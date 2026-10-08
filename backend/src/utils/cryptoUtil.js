import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

function getKey() {
    const key = Buffer.from(process.env.ENCRYPTION_KEY || '82c0add07beb82acc77a6d867a5a49a46b2301dadb8e0547dbc37fd43959647a', 'hex');
    if (key.length !== 32) {
        throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters).');
    }
    return key;
}

export function encrypt(plainText) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    return `${iv.toString('hex')}:${cipher.getAuthTag().toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(payload) {
    const [ivHex, tagHex, dataHex] = payload.split(':');
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    return Buffer.concat([
        decipher.update(Buffer.from(dataHex, 'hex')),
        decipher.final()
    ]).toString('utf8');
}