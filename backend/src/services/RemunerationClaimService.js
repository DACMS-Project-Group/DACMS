import RemunerationClaimRepository from '../repositories/RemunerationClaimRepository.js';

class RemunerationClaimService {
    constructor() {
        this.remunerationClaimRepository = new RemunerationClaimRepository();
    }

    async listClaimsForStudent(studentId) {
        return this.remunerationClaimRepository.findByStudentId(studentId);
    }
    async getClaimForStudent(claimId, studentId) {
    return this.remunerationClaimRepository.findByIdForStudent(
        claimId,
        studentId
    );
}

    /**
     * Generates a claim for all approved, unclaimed work session hours on the
     * given application, using the position's payment scale rate.
     */
    async generateClaim(studentId, applicationId) {
        const application = await this.remunerationClaimRepository.findApplicationForStudent(
            applicationId,
            studentId
        );
        if (!application) {
            throw new Error('Application not found, does not belong to you, or has no active position yet.');
        }

        const sinceDate = await this.remunerationClaimRepository.findLatestClaimDate(applicationId);

        const totalHours = await this.remunerationClaimRepository.sumUnclaimedApprovedHours(
            application.PositionID,
            sinceDate
        );

        if (totalHours <= 0) {
            throw new Error('No approved, unclaimed hours are available to claim yet.');
        }

        const hourlyRate = Number(application.StandardHourlyRate);
        const totalAmount = Math.round(totalHours * hourlyRate * 100) / 100;
        const referenceNumber = this._generateReferenceNumber(applicationId);

        // Claim period runs from the last claim's date (or the beginning of time if
        // this is the first claim) through today.
        const periodStartDate = sinceDate ? new Date(sinceDate) : null;
        const periodEndDate = new Date();

        return this.remunerationClaimRepository.create({
            referenceNumber,
            applicationId,
            moduleId: application.ModuleID,
            periodStartDate,
            periodEndDate,
            totalHoursClaimed: totalHours,
            totalClaimAmount: totalAmount,
            hourlyRateApplied: hourlyRate,
        });
    }

    _generateReferenceNumber(applicationId) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const uniqueSuffix = Date.now().toString(36).toUpperCase();
        return `CLAIM-${year}-${month}-${String(applicationId).padStart(3, '0')}-${uniqueSuffix}`;
    }
}

export default new RemunerationClaimService();