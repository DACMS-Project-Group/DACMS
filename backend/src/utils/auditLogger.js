import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const logDirectory = path.resolve(__dirname, '../../logs');
const logFile = path.join(logDirectory, 'audit.log');

/**
 * Audit entries must never persist or expose numeric identifiers.
 * Resolve the acting user to a human-readable name and email instead.
 */
function sanitizeName(value) {
    if (typeof value !== 'string') {
        return null;
    }

    const name = value.replace(/\s+/g, ' ').trim();

    if (!name || /\bundefined\b/i.test(name)) {
        return null;
    }

    return name;
}

function sanitizeEmail(value) {
    if (typeof value !== 'string') {
        return null;
    }

    const email = value.trim();

    return !email || /\bundefined\b/i.test(email) ? null : email;
}

export async function writeAuditLog({
    userId,
    user,
    role,
    action,
    recordType,
    recordReference = null,
    event = {}
}) {
    try {
        await fs.mkdir(logDirectory, { recursive: true });

        // Prefer caller-supplied identity; otherwise fall back to null.
        // The reader resolves legacy user_id lookups server-side.
        const identity =
            user?.name || user?.email
                ? {
                      name: sanitizeName(user.name),
                      email: sanitizeEmail(user.email)
                  }
                : { name: null, email: null };

        const logEntry = {
            timestamp: new Date().toISOString(),
            user_name: identity.name,
            user_email: identity.email,
            role,
            action,
            record_type: recordType ?? null,
            record_reference:
                recordReference === null || recordReference === undefined
                    ? null
                    : String(recordReference),
            event
        };

        await fs.appendFile(
            logFile,
            JSON.stringify(logEntry) + '\n',
            'utf8'
        );
    } catch (error) {
        console.error('Audit logging failed:', error);
    }
}
