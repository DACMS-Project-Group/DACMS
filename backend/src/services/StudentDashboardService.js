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

    /** Groups completed work sessions by month, summing hours. Last 6 months, oldest first. */
    _buildMonthlyHours(sessions) {
        const byMonth = new Map();

        for (const session of sessions) {
            if (session.TotalHoursWorked == null) continue;

            const start = new Date(session.StartTime);
            const key = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`;

            byMonth.set(key, (byMonth.get(key) || 0) + Number(session.TotalHoursWorked));
        }

        return Array.from(byMonth.entries())
            .sort(([a], [b]) => (a > b ? 1 : -1))
            .slice(-6)
            .map(([month, totalHours]) => ({
                month,
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
}

export default new StudentDashboardService();
