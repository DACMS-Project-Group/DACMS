import AdminService from '../services/AdminService.js';
import NotificationService from '../services/NotificationService.js';
import ModuleBudget from '../models/ModuleBudget.js';
import ExportedClaim from '../templates/ExportedClaim.js';
import AdmZip from 'adm-zip';
import getAuthUserId from '../utils/getAuthUserId.js';
import { writeAuditLog } from '../utils/auditLogger.js';

class AdminController {
    static async getDashboardSummary(req, res) {
        try {
            const data = await AdminService.getDashboardSummary();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getBudgetsSummary(req, res) {
        try {
            const data = await AdminService.getBudgetsSummary();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getBudgetById(req, res) {
        const { budget_id } = req.params;

        try {
            const data = await AdminService.getBudgetById(budget_id);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async createBudget(req, res) {
        try {
            const budgetData = req.body || {};
            const budget = new ModuleBudget(budgetData);
            budget.validate();

            const data = await AdminService.createBudget(budget);
            return res.status(201).json({
                message: 'Budget creation Successful',
                budget_id: data.data
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async editBudget(req, res) {
        const { id } = req.params;
        try {
            const updateData = req.body || {};
            const data = await AdminService.editBudget(id, updateData);
            return res.status(200).json({
                message: 'Budget updated successfully',
                data: data.data
            });
        } catch (error) {
            if (error.message === "Budget not found" || error.message === "No fields provided to update") {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    static async getClaimsSummary(req, res) {
        try {
            const data = await AdminService.getClaimsSummary();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getClaimsForExport(req, res) {
        try {
            const data = await AdminService.getClaimsForExport();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getClaimById(req, res) {
        const { claim_id } = req.params;
        try {
            const data = await AdminService.getClaimById(claim_id);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async approveClaim(req, res) {
        const { claim_id } = req.params;

        try {
            const adminId = getAuthUserId(req);
            const data = await AdminService.approveClaim(claim_id);

            if (data) {
                const claim = data.data;
                const decisionMessage =
                    `Claim ${claim.ClaimReferenceNumber} for ${claim.ModuleCode} has been ` +
                    `approved by the administrator as the final claim decision.`;
                await Promise.all([
                    NotificationService.sendNotification({
                        recipientId: claim.StudentID,
                        subject: 'Remuneration claim approved',
                        type: 'Claim Verified',
                        message:
                            `${decisionMessage} Approved hours: ${claim.TotalHoursClaimed}; ` +
                            `amount: R${Number(claim.TotalClaimAmount).toFixed(2)}. ` +
                            `View /claim-detail/${claim.ClaimID}.`
                    }),
                    NotificationService.sendNotification({
                        recipientId: claim.LecturerID,
                        subject: 'Remuneration claim approval completed',
                        type: 'Claim Verified',
                        message:
                            `${decisionMessage} No further review is required. ` +
                            `View /review-claim/${claim.ClaimID}.`
                    })
                ]);
                await writeAuditLog({
                    userId: adminId,
                    role: 'admin',
                    action: 'ADMIN_CLAIM_APPROVAL',
                    recordType: 'claim',
                    recordId: claim_id,
                    event: {
                        result: 'approved'
                    }
                });
            }

            return res.status(200).json({
                message: 'Claim approved successfully',
                data
            });
        } catch (error) {
            if (error.message === 'Claim not found') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    static async getAppointments(req, res) {
        try {
            const data = await AdminService.getAppointments();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getPositionById(req, res) {
        const { position_id } = req.params;

        try {
            const data = await AdminService.getPositionById(position_id);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async reviewPosition(req, res) {
        const { position_id } = req.params;
        const { action, comment } = req.body;

        try {
            const adminId = getAuthUserId(req);
            const data = await AdminService.reviewPosition(position_id, action, comment);
            const details = data.data.notificationDetails;
            const reference = details.applicationReference || `#${details.applicationId}`;
            const nextStep = action === 'Approved'
                ? 'The appointment is approved and the student can review the appointment details.'
                : action === 'Returned'
                    ? 'The application was returned for changes; the student should review the administrator comment.'
                    : 'The appointment was not approved; the student should review the administrator comment.';
            const decisionSummary =
                `Position decision for application ${reference}, ${details.studentName} ` +
                `(${details.studentNumber}), ${details.moduleCode}: ${action.toLowerCase()}. ` +
                `${nextStep} Administrator comment: ${comment?.trim() || 'No comment provided.'} ` +
                `Application #${details.applicationId}.`;
            await Promise.all([
                NotificationService.sendNotification({
                    recipientId: details.studentId,
                    subject: `Assistant appointment ${action.toLowerCase()}`,
                    type: `Position ${action}`,
                    message: `${decisionSummary} View /application-detail/${details.applicationId}.`
                }),
                NotificationService.sendNotification({
                    recipientId: details.lecturerId,
                    subject: `Assistant appointment ${action.toLowerCase()}`,
                    type: `Position ${action}`,
                    message: `${decisionSummary} View /review-applications.`
                })
            ]);

            if (data) {
                await writeAuditLog({
                    userId: adminId,
                    role: 'admin',
                    action: 'ADMIN_APPOINTMENT_REVIEW',
                    recordType: 'appointment',
                    recordId: position_id,
                    event: {
                        decision: action
                    }
                });
            }

            return res.status(200).json({
                message: `Position decision processed successfully (${action})`,
                data: {
                    position_id: data.data.position_id,
                    status: data.data.status,
                    comment: data.data.comment
                }
            });
        } catch (error) {
            if (
                error.message.startsWith('Invalid action') ||
                error.message === 'Position ID must be a positive integer'
            ) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === 'Position not found') {
                return res.status(404).json({ error: error.message });
            }
            if (
                error.message === 'Position is not awaiting admin review' ||
                error.message === 'Application is not approved for admin review'
            ) {
                return res.status(409).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    static async exportClaims(req, res) {
        const claims = Array.isArray(req.body?.claims) ? req.body.claims : [];

        if (!claims.length) {
            return res.status(400).json({ error: 'No claim IDs provided.' });
        }

        try {
            const exportData = await AdminService.exportClaims(claims);
            const zip = new AdmZip();
            const adminId = getAuthUserId(req);

            for (const item of exportData.data) {
                const pdfBuffer = await ExportedClaim.buildClaimPdfBuffer(item);
                const safeName = (item.claim?.reference_number || `claim-${item.claim?.id || 'export'}`)
                    .replace(/[^a-zA-Z0-9_-]/g, '_');

                zip.addFile(`${safeName}.pdf`, pdfBuffer);
            }

            const zipBuffer = zip.toBuffer();

            await writeAuditLog({
                userId: adminId,
                role: 'admin',
                action: 'ADMIN_CLAIM_EXPORT',
                recordType: 'claim_export',
                recordId: null,
                event: {
                    claim_ids: claims,
                    record_count: exportData.data.length
                }
            });

            res.setHeader('Content-Type', 'application/zip');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="claims-export-${Date.now()}.zip"`
            );

            return res.send(zipBuffer);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default AdminController;