import BaseRepository from './BaseRepository.js';
import Student from '../models/Student.js';

// camelCase request field -> real STUDENT column name. Only fields listed
// here can ever be written - anything else in the request body is silently
// ignored, which is what keeps updateProfile() safe to call with a whole
// req.body object directly.
const STUDENT_FIELD_MAP = {
    studyLevel: 'StudyLevel',
    idPassportNumber: 'ID_PassportNumber',
    title: 'Title',
    gender: 'Gender',
    dateOfBirth: 'DateOfBirth',
    incomeTaxNumber: 'IncomeTaxNumber',
    saCitizen: 'SACitizen',
    residentialAddress: 'ResidentialAddress',
    postalAddress: 'PostalAddress',
    nextOfKinName: 'NextOfKinName',
    nextOfKinMobile: 'NextOfKinMobile',
    highestQualification: 'HighestQualification',
    contactDetails: 'ContactDetails',
    bankName: 'BankName',
    accountNumber: 'AccountNumber',
    accountType: 'AccountType',
    branchCode: 'BranchCode',
    accountHolderName: 'AccountHolderName',

    initials: 'Initials',
    middleNames: 'MiddleNames',
    nickName: 'NickName',
    race: 'Race',
    maritalStatus: 'MaritalStatus',
    previousSurname: 'PreviousSurname',
    homeLanguage: 'HomeLanguage',
    preferenceLanguage: 'PreferenceLanguage',
    disability: 'Disability',
    primaryEmploymentOutside: 'PrimaryEmploymentOutside',
    studentType: 'StudentType',
    nationality: 'Nationality',
    countryOfBirth: 'CountryOfBirth',
    countryOfPassportIssue: 'CountryOfPassportIssue',
    permitNumber: 'PermitNumber',
    currentlyEmployedByNwu: 'CurrentlyEmployedByNwu',
    oeCodeAndName1: 'OeCodeAndName1',
    jobName1: 'JobName1',
    oeCodeAndName2: 'OeCodeAndName2',
    jobName2: 'JobName2',

    nextOfKinTitle: 'NextOfKinTitle',
    nextOfKinInitials: 'NextOfKinInitials',
    nextOfKinSurname: 'NextOfKinSurname',
    nextOfKinRelationship: 'NextOfKinRelationship',
    nextOfKinDaytimePhoneNo: 'NextOfKinDaytimePhoneNo',
    isNextOfKinNwuEmployee: 'IsNextOfKinNwuEmployee',
    nextOfKinNwuNumber: 'NextOfKinNwuNumber',

    resUnitNo: 'ResUnitNo',
    resComplex: 'ResComplex',
    resStreetNo: 'ResStreetNo',
    resStreetName: 'ResStreetName',
    resSuburb: 'ResSuburb',
    resTownCity: 'ResTownCity',
    resPostalCode: 'ResPostalCode',
    sameAsResidential: 'SameAsResidential',
    poBoxNo: 'PoBoxNo',
    privateBagNo: 'PrivateBagNo',
    postOfficeBranch: 'PostOfficeBranch',
    mailingPostalCode: 'MailingPostalCode',
    workPhoneNo: 'WorkPhoneNo',

    qualificationInstitution: 'QualificationInstitution',
    qualificationType: 'QualificationType',
    qualificationStatus: 'QualificationStatus',
    qualificationAwardedDate: 'QualificationAwardedDate',

    accountHolderRelationship: 'AccountHolderRelationship',

    declarationInitialsSurname: 'DeclarationInitialsSurname',
    declarationDate: 'DeclarationDate',
    declarationAgreed: 'DeclarationAgreed',
    signature: 'Signature',

    // Intentionally NOT editable: StudentID, StudentNumber (identity,
    // shouldn't change after registration).
};

// Identity fields that live on APP_USER, not STUDENT.
const APP_USER_FIELD_MAP = {
    firstName: 'FName',
    lastName: 'LName',
    email: 'Email',
};

function buildSetClause(fieldMap, updates, startIndex) {
    const setClauses = [];
    const values = [];
    let paramIndex = startIndex;

    for (const [jsKey, dbColumn] of Object.entries(fieldMap)) {
        if (updates[jsKey] !== undefined) {
            setClauses.push(`"${dbColumn}" = $${paramIndex}`);
            values.push(updates[jsKey]);
            paramIndex++;
        }
    }

    return { setClauses, values, nextIndex: paramIndex };
}

class StudentRepository extends BaseRepository {
    constructor() {
        super('"STUDENT"', Student);
    }

    async findByUserId(userId) {
        const rows = await this.query(
            `
            SELECT u.*, s.*
            FROM "APP_USER" u
            JOIN "STUDENT" s ON s."StudentID" = u."UserID"
            WHERE u."UserID" = $1
            `,
            [userId]
        );
        return rows[0] ? Student.fromDb(rows[0]) : null;
    }

    /**
     * Updates whichever editable fields are present in `updates`, across
     * both STUDENT and APP_USER (for first/last name and email) in a single
     * transaction. Only keys in STUDENT_FIELD_MAP / APP_USER_FIELD_MAP are
     * ever written, so a plain req.body can be passed straight through.
     */
    async updateProfile(userId, updates) {
        const student = buildSetClause(STUDENT_FIELD_MAP, updates, 2);
        const user = buildSetClause(APP_USER_FIELD_MAP, updates, 2);

        if (student.setClauses.length === 0 && user.setClauses.length === 0) {
            return this.findByUserId(userId);
        }

        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            if (student.setClauses.length > 0) {
                await client.query(
                    `UPDATE "STUDENT" SET ${student.setClauses.join(', ')} WHERE "StudentID" = $1`,
                    [userId, ...student.values]
                );
            }

            if (user.setClauses.length > 0) {
                await client.query(
                    `UPDATE "APP_USER" SET ${user.setClauses.join(', ')} WHERE "UserID" = $1`,
                    [userId, ...user.values]
                );
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            if (error.code === '23505') {
                throw new Error('That email address is already in use.');
            }
            throw error;
        } finally {
            client.release();
        }

        return this.findByUserId(userId);
    }
}

export default StudentRepository;