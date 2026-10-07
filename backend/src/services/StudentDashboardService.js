import StudentRepository from '../repositories/StudentRepository.js';
import DemiApplicationRepository from '../repositories/DemiApplicationRepository.js';
import WorkSessionRepository from '../repositories/WorkSessionRepository.js';
import RemunerationClaimRepository from '../repositories/RemunerationClaimRepository.js';

const PENDING_APPLICATION_STATUSES = ['Pending', 'In Review'];
const PENDING_CLAIM_STATUSES = ['Pending', 'Under Review'];

class StudentDashboardService {
    constructor() {
        this.studentRepository = new StudentRepository();
        this.demiApplicationRepository = new DemiApplicationRepository();
        this.workSessionRepository = new WorkSessionRepository();
        this.remunerationClaimRepository = new RemunerationClaimRepository();
    }

    async getDashboard(studentId) {
        const [student, positions, applications, sessions, claims] = await Promise.all([
            this.studentRepository.findByUserId(studentId),
            this.workSessionRepository.findActivePositionsForStudent(studentId),
            this.demiApplicationRepository.findByStudentId(studentId),
            this.workSessionRepository.findByStudentId(studentId),
            this.remunerationClaimRepository.findByStudentId(studentId),
        ]);

        if (!student) {
            throw new Error('Student profile not found.');
        }

        return {
            profile: {
                student_id: student.student_id,
                name: `${student.first_name} ${student.last_name}`,
                student_number: student.student_number,
                study_level: student.study_level,
            },
            stats: this._buildStats(positions, applications, sessions, claims),
            monthlyHours: this._buildMonthlyHours(sessions),
            pendingApplications: this._buildPendingApplications(applications),
            applications: this._buildApplications(applications),
            claims: this._buildClaims(claims),
            recentActivity: this._buildRecentActivity(applications, sessions, claims),
        };
    }

    _buildStats(positions, applications, sessions, claims) {
        const pendingApplications = applications.filter((a) =>
            PENDING_APPLICATION_STATUSES.includes(a.ApplicationStatus)
        );
        const pendingClaims = claims.filter((c) => PENDING_CLAIM_STATUSES.includes(c.ClaimStatus));

        const now = new Date();
        const hoursThisMonth = sessions
            .filter((s) => {
                const start = new Date(s.StartTime);
                return (
                    s.TotalHoursWorked != null &&
                    start.getFullYear() === now.getFullYear() &&
                    start.getMonth() === now.getMonth()
                );
            })
            .reduce((sum, s) => sum + Number(s.TotalHoursWorked), 0);

        return {
            active_positions: positions.length,
            pending_applications: pendingApplications.length,
            hours_this_month: Math.round(hoursThisMonth * 100) / 100,
            pending_claims: pendingClaims.length,
        };
    }

    /** Groups completed work sessions by module, summing hours. */
    _buildMonthlyHours(sessions) {
        const byModule = new Map();

        for (const session of sessions) {
            if (session.TotalHoursWorked == null || !session.ModuleCode) continue;

            byModule.set(
                session.ModuleCode,
                (byModule.get(session.ModuleCode) || 0) + Number(session.TotalHoursWorked)
            );
        }

        return Array.from(byModule.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([module, totalHours]) => ({
                module,
                total_hours: Math.round(totalHours * 100) / 100,
            }));
    }

    /** Applications still awaiting a decision, most recent first, capped at 5. */
    _buildPendingApplications(applications) {
        return applications
            .filter((a) => PENDING_APPLICATION_STATUSES.includes(a.ApplicationStatus))
            .slice(0, 5)
            .map((a) => ({
                application_id: a.ApplicationID,
                status: a.ApplicationStatus,
                date_submitted: a.DateSubmitted,
                module: a.ModuleCode,
            }));
    }

    _buildApplications(applications) {
        return applications.slice(0, 5).map((application) => ({
            application_id: application.ApplicationID,
            status: application.ApplicationStatus,
            date_submitted: application.DateSubmitted,
            module: application.ModuleCode,
        }));
    }

    _buildClaims(claims) {
        return claims.slice(0, 5).map((claim) => ({
            claim_id: claim.ClaimID,
            reference: claim.ClaimReferenceNumber,
            module: claim.ModuleCode,
            amount: Number(claim.TotalClaimAmount ?? 0),
            status: claim.ClaimStatus,
            submitted_at: claim.SubmissionDate,
        }));
    }

    _buildRecentActivity(applications, sessions, claims) {
        return [
            ...applications.map((application) => ({
                text: `Application for ${application.ModuleCode}: ${application.ApplicationStatus}`,
                date: application.DateSubmitted,
            })),
            ...sessions.map((session) => ({
                text: `Work session for ${session.ModuleCode} recorded`,
                date: session.StartTime,
            })),
            ...claims.map((claim) => ({
                text: `Claim for ${claim.ModuleCode}: ${claim.ClaimStatus}`,
                date: claim.SubmissionDate,
            })),
        ]
            .filter((activity) => activity.date)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
    }
}

export default new StudentDashboardService();
