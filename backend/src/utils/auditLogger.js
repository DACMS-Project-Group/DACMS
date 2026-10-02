import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirectory = path.resolve(__dirname, '../../logs');
const logFile = path.join(logDirectory, 'audit.log');

export async function writeAuditLog({
    userId,
    role,
    action,
    recordType,
    recordId,
    event = {}
}) {
    try {
        await fs.mkdir(logDirectory, { recursive: true });

        const logEntry = {
            timestamp: new Date().toISOString(),
            user_id: userId,
            role,
            action,
            record_type: recordType,
            record_id: recordId,
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