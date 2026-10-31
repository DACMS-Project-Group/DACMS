import AuditLogService from '../services/AuditLogService.js';

class AuditLogController {
    static async getAuditLogs(req, res) {
        try {
            const filters = {
                from: req.query.from,
                to: req.query.to,
                action: req.query.action,
                user: req.query.user,
                recordType: req.query.recordType,
                recordReference: req.query.recordReference
            };

            const data = await AuditLogService.getAuditLogs(filters);
            return res.status(200).json(data);
        } catch (error) {
            console.error('Failed to load audit logs:', error);
            return res.status(500).json({
                error: 'Unable to load audit logs.'
            });
        }
    }
}

export default AuditLogController;
