import AuditLogService from '../services/AuditLogService.js';

class AuditLogController {
    static async getAuditLogs(req, res) {
        try {
            const data = await AuditLogService.getAuditLogs();
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
