import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import TwoFactorRepository from '../repositories/TwoFactorRepository.js';
import { encrypt, decrypt } from '../utils/cryptoUtil.js';

const ISSUER = 'AACMS';
const STEP_SECONDS = 30;
const BACKUP_CODE_COUNT = 10;
const BCRYPT_ROUNDS = 10;

authenticator.options = { window: 1 }; // tolerate +/- one 30s step of clock drift

class TwoFactorService {
    constructor() {
        this.twoFactorRepository = new TwoFactorRepository();
    }

    // Returns the matched time step, or null if the code is invalid.
    matchTotp(code, secret) {
        const delta = authenticator.checkDelta(code, secret);
        if (delta === null || delta === undefined) return null;
        return Math.floor(Date.now() / 1000 / STEP_SECONDS) + delta;
    }

    async getAdminOrThrow(userId) {
        const admin = await this.twoFactorRepository.getAdminTwoFactor(userId);
        if (!admin) {
            throw new Error('Administrator not found.');
        }
        return admin;
    }

    async isConfigured(userId) {
        const admin = await this.getAdminOrThrow(userId);
        return admin.TFAConfirmedAt !== null;
    }

    async startSetup(userId) {
        const admin = await this.getAdminOrThrow(userId);
        if (admin.TFAConfirmedAt != null) {
            throw new Error('Two-factor authentication is already configured.');
        }

        const secret = authenticator.generateSecret();
        const saved = await this.twoFactorRepository.savePendingSecret(userId, encrypt(secret));
        if (!saved) {
            throw new Error('Two-factor authentication is already configured.');
        }

        const otpauth = authenticator.keyuri(admin.Email, ISSUER, secret);
        return { qrCode: await QRCode.toDataURL(otpauth), manualKey: secret };
    }

    async confirmSetup(userId, code) {
        const admin = await this.getAdminOrThrow(userId);
        if (admin.TFAConfirmedAt != null) {
            throw new Error('Two-factor authentication is already configured.');
        }
        if (!admin.TFASecret) {
            throw new Error('Two-factor setup has not been started.');
        }

        const step = this.matchTotp(String(code ?? '').trim(), decrypt(admin.TFASecret));
        if (step === null) {
            throw new Error('Invalid code.');
        }

        const backupCodes = Array.from({ length: BACKUP_CODE_COUNT }, () =>
            crypto.randomBytes(5).toString('hex')
        );
        const hashed = await Promise.all(backupCodes.map((c) => bcrypt.hash(c, BCRYPT_ROUNDS)));

        const confirmed = await this.twoFactorRepository.confirmSetup(userId, hashed, step);
        if (!confirmed) {
            throw new Error('Two-factor authentication is already configured.');
        }

        return { backupCodes }; // plaintext, returned this once only
    }

    async verifyLogin(userId, rawCode) {
        const admin = await this.getAdminOrThrow(userId);
        if (!admin.TFAConfirmedAt) {
            throw new Error('Two-factor authentication has not been set up.');
        }

        const code = String(rawCode ?? '').trim().toLowerCase();
        let verified = false;

        if (/^\d{6}$/.test(code)) {
            const step = this.matchTotp(code, decrypt(admin.TFASecret));
            verified = step !== null && (await this.twoFactorRepository.advanceTotpStep(userId, step));
        } else if (code) {
            for (const hash of admin.TwoFactorBackupCodes) {
                if (await bcrypt.compare(code, hash)) {
                    verified = await this.twoFactorRepository.consumeBackupCode(userId, hash);
                    break;
                }
            }
        }

        if (!verified) {
            throw new Error('Invalid code.');
        }

        return { user_id: admin.AdminID, email: admin.Email, role_id: admin.RoleID };
    }
}

export default new TwoFactorService();