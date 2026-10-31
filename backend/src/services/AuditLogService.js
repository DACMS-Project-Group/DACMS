import fs from 'fs/promises';
import path from 'path';
import pool from '../config/db.js';
import { logDirectory } from '../utils/auditLogger.js';

const MAX_LOG_FILES = 20;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

function sanitizeText(value) {
    if (value === null || value === undefined) {
        return null;
    }

    const trimmed = String(value).trim();

    if (!trimmed || /\bundefined\b/i.test(trimmed)) {
        return null;
    }

    return trimmed;
}

function parseLogLine(line, source) {
    if (!line.trim()) {
        return null;
    }

    try {
        const entry = JSON.parse(line);

        if (
            !entry ||
            typeof entry !== 'object' ||
            typeof entry.timestamp !== 'string'
        ) {
            return null;
        }

        return {
            timestamp: entry.timestamp,
            user_name: sanitizeText(entry.user_name),
            user_email: sanitizeText(entry.user_email),
            role: entry.role || 'unknown',
            action: entry.action || 'UNKNOWN_ACTION',
            record_type: sanitizeText(entry.record_type),
            record_reference: sanitizeText(entry.record_reference),
            event:
                entry.event && typeof entry.event === 'object'
                    ? entry.event
                    : {},
            source,
            legacy_user_id: sanitizeText(entry.user_id)
        };
    } catch {
        // Ignore malformed lines so one bad entry cannot break the log view.
        return null;
    }
}

class AuditLogService {
    static async listLogFiles() {
        try {
            const entries = await fs.readdir(logDirectory, {
                withFileTypes: true
            });

            return entries
                .filter(
                    (entry) =>
                        entry.isFile() &&
                        entry.name.toLowerCase().endsWith('.log')
                )
                .map((entry) => entry.name)
                .sort()
                .reverse()
                .slice(0, MAX_LOG_FILES);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    static async readAllEntries() {
        const files = await this.listLogFiles();
        const entries = [];

        for (const file of files) {
            const filePath = path.join(logDirectory, file);

            try {
                const stats = await fs.stat(filePath);

                if (stats.size === 0 || stats.size > MAX_FILE_BYTES) {
                    continue;
                }

                const contents = await fs.readFile(filePath, 'utf8');

                for (const line of contents.split(/\r?\n/)) {
                    const entry = parseLogLine(line, file);

                    if (entry) {
                        entries.push(entry);
                    }
                }
            } catch (error) {
                // A single unreadable file should not fail the whole request.
                console.error(
                    `Unable to read audit log file ${file}:`,
                    error
                );
            }
        }

        entries.sort(
            (first, second) =>
                (Date.parse(second.timestamp) || 0) -
                (Date.parse(first.timestamp) || 0)
        );

        return { entries, fileCount: files.length };
    }

    /**
     * Older audit lines only contain a user_id. Resolve those to names so that
     * identifiers are never exposed, while keeping the historical trail useful.
     */
    static async resolveLegacyIdentities(entries) {
        const userIds = [
            ...new Set(
                entries
                    .filter(
                        (entry) =>
                            !entry.user_name &&
                            !entry.user_email &&
                            entry.legacy_user_id !== null
                    )
                    .map((entry) => Number(entry.legacy_user_id))
                    .filter((userId) => Number.isInteger(userId) && userId > 0)
            )
        ];

        if (userIds.length === 0) {
            return new Map();
        }

        try {
            const result = await pool.query(
                'SELECT "UserID", "FName", "LName", "Email" FROM "APP_USER" WHERE "UserID" = ANY($1::int[])',
                [userIds]
            );

            return new Map(
                result.rows.map((row) => {
                    const name = [row.FName, row.LName]
                        .filter(Boolean)
                        .join(' ')
                        .trim();

                    return [
                        row.UserID,
                        {
                            name: sanitizeText(name),
                            email: sanitizeText(row.Email)
                        }
                    ];
                })
            );
        } catch (error) {
            console.error('Audit log identity lookup failed:', error);
            return new Map();
        }
    }

    static buildStats(entries, fileCount) {
        const users = new Set();
        let adminLogins = 0;
        let exports = 0;
        let offHours = 0;

        for (const entry of entries) {
            const identity = entry.user_email || entry.user_name;

            if (identity) {
                users.add(identity);
            }

            if (entry.action === 'ADMIN_LOGIN') {
                adminLogins += 1;
            }

            if (entry.action === 'ADMIN_CLAIM_EXPORT') {
                exports += 1;
            }

            // Flag activity outside 08:00–17:00 SAST as potential off-hours review.
            const hour = new Date(entry.timestamp).getUTCHours();
            // SAST is UTC+2, so 08:00 SAST = 06:00 UTC, 17:00 SAST = 15:00 UTC.
            if (hour < 6 || hour >= 15) {
                offHours += 1;
            }
        }

        return {
            total_events: entries.length,
            unique_users: users.size,
            admin_logins: adminLogins,
            bulk_exports: exports,
            off_hours_activity: offHours,
            last_activity: entries.length ? entries[0].timestamp : null,
            log_files: fileCount
        };
    }

    static async getAuditLogs(filters = {}) {
        const {
            from,
            to,
            action,
            user,
            recordType,
            recordReference
        } = filters;

        const { entries, fileCount } = await this.readAllEntries();
        const legacyIdentities = await this.resolveLegacyIdentities(entries);

        let logs = entries.map((entry) => {
            const legacy = legacyIdentities.get(
                Number(entry.legacy_user_id)
            );

            return {
                timestamp: entry.timestamp,
                user_name: entry.user_name || legacy?.name || null,
                user_email: entry.user_email || legacy?.email || null,
                role: entry.role,
                action: entry.action,
                record_type: entry.record_type,
                record_reference: entry.record_reference,
                event: entry.event,
                source: entry.source
            };
        });

        // --- Time range filter ---
        if (from) {
            const fromMs = new Date(from).setUTCHours(0, 0, 0, 0);
            logs = logs.filter((log) => Date.parse(log.timestamp) >= fromMs);
        }

        if (to) {
            const toMs = new Date(to).setUTCHours(23, 59, 59, 999);
            logs = logs.filter((log) => Date.parse(log.timestamp) <= toMs);
        }

        // --- Facet filters ---
        if (action) {
            logs = logs.filter((log) => log.action === action);
        }

        if (user) {
            const u = user.toLowerCase();
            logs = logs.filter(
                (log) =>
                    (log.user_name || '').toLowerCase().includes(u) ||
                    (log.user_email || '').toLowerCase().includes(u)
            );
        }

        if (recordType) {
            logs = logs.filter((log) => log.record_type === recordType);
        }

        if (recordReference) {
            const r = recordReference.toLowerCase();
            logs = logs.filter(
                (log) => (log.record_reference || '').toLowerCase().includes(r)
            );
        }

        // Default sort: newest first.
        logs.sort(
            (first, second) =>
                (Date.parse(second.timestamp) || 0) -
                (Date.parse(first.timestamp) || 0)
        );

        return {
            stats: this.buildStats(logs, fileCount),
            logs
        };
    }
}

export default AuditLogService;
