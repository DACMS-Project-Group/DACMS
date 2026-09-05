import bcrypt from 'bcrypt';
import pool from '../config/db.js';

const BCRYPT_SALT_ROUNDS = 10;

const ROLE_IDS = Object.freeze({
    STUDENT: 1,
    LECTURER: 2,
    ADMINISTRATOR: 3
});

function readRequiredString(value) {
    return typeof value === 'string' && value.trim() !== ''
        ? value.trim()
        : null;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseRoleId(value) {
    const roleId = Number(value);

    return Number.isInteger(roleId) &&
        Object.values(ROLE_IDS).includes(roleId)
        ? roleId
        : null;
}

function getDatabaseError(error) {
    if (error.code === '23505') {
        return {
            status: 409,
            message: 'A user with that email or identifier already exists.'
        };
    }

    if (error.code === '23503') {
        return {
            status: 400,
            message: 'The supplied user data references an invalid record.'
        };
    }

    return {
        status: 500,
        message: 'An unexpected database error occurred.'
    };
}

class UserController {
    async createUser(req, res) {
        const body = req.body ?? {};

        const firstName = readRequiredString(body.first_name);
        const lastName = readRequiredString(body.last_name);
        const email = readRequiredString(body.email)?.toLowerCase();
        const password = body.password;
        const roleId = parseRoleId(body.role_id);

        if (!firstName || !lastName || !email || !password || !roleId) {
            return res.status(400).json({
                error: 'First name, last name, email, password, and a valid role are required.'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                error: 'A valid email address is required.', email: email
            });
        }

        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({
                error: 'Password must contain at least 8 characters.'
            });
        }

        const databaseClient = await pool.connect();

        try {
            const hashedPassword = await bcrypt.hash(
                password,
                BCRYPT_SALT_ROUNDS
            );

            await databaseClient.query('BEGIN');

            const userResult = await databaseClient.query(
                `
                    INSERT INTO "APP_USER"
                        ("FName", "LName", "Email", "PasswordHash", "RoleID")
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING "UserID";
                `,
                [firstName, lastName, email, hashedPassword, roleId]
            );

            const userId = userResult.rows[0].UserID;

            if (roleId === ROLE_IDS.STUDENT) {
                const studentNumber = readRequiredString(body.student_number);
                const studyLevel = readRequiredString(body.study_level);
                const contactDetails = readRequiredString(body.contact_details);
                const bankName = readRequiredString(body.bank_name);
                const accountNumber = readRequiredString(body.account_number);
                const branchCode = readRequiredString(body.branch_code);

                if (
                    !studentNumber ||
                    !studyLevel ||
                    !contactDetails ||
                    !bankName ||
                    !accountNumber ||
                    !branchCode
                ) {
                    return await this.rollbackWithResponse(
                        databaseClient,
                        res,
                        400,
                        'All student profile fields are required.'
                    );
                }

                if (!['Undergraduate', 'Postgraduate'].includes(studyLevel)) {
                    return await this.rollbackWithResponse(
                        databaseClient,
                        res,
                        400,
                        'Study level must be Undergraduate or Postgraduate.'
                    );
                }

                await databaseClient.query(
                    `
                        INSERT INTO "STUDENT"
                            (
                                "StudentID",
                                "StudentNumber",
                                "StudyLevel",
                                "ContactDetails",
                                "BankName",
                                "AccountNumber",
                                "BranchCode"
                            )
                        VALUES ($1, $2, $3, $4, $5, $6, $7);
                    `,
                    [
                        userId,
                        studentNumber,
                        studyLevel,
                        contactDetails,
                        bankName,
                        accountNumber,
                        branchCode
                    ]
                );
            }

            if (roleId === ROLE_IDS.LECTURER) {
                const department = readRequiredString(body.department);

                if (!department) {
                    return await this.rollbackWithResponse(
                        databaseClient,
                        res,
                        400,
                        'Department is required for lecturers.'
                    );
                }

                await databaseClient.query(
                    `
                        INSERT INTO "LECTURER"
                            ("LecturerID", "Department")
                        VALUES ($1, $2);
                    `,
                    [userId, department]
                );
            }

            if (roleId === ROLE_IDS.ADMINISTRATOR) {
                const mfaEnabled = body.mfa_enabled ?? true;
                const budgetRights =
                    body.budget_allocation_rights ?? true;

                if (
                    typeof mfaEnabled !== 'boolean' ||
                    typeof budgetRights !== 'boolean'
                ) {
                    return await this.rollbackWithResponse(
                        databaseClient,
                        res,
                        400,
                        'Administrator permissions must be boolean values.'
                    );
                }

                await databaseClient.query(
                    `
                        INSERT INTO "ADMINISTRATOR"
                            (
                                "AdminID",
                                "MFA_Enabled",
                                "BudgetAllocationRights"
                            )
                        VALUES ($1, $2, $3);
                    `,
                    [userId, mfaEnabled, budgetRights]
                );
            }

            await databaseClient.query('COMMIT');

            return res.status(201).json({
                message: 'User created successfully.',
                user_id: userId,
                email,
                role_id: roleId
            });
        } catch (error) {
            await databaseClient.query('ROLLBACK');

            const databaseError = getDatabaseError(error);

            console.error('User creation failed:', error);

            return res.status(databaseError.status).json({
                error: databaseError.message
            });
        } finally {
            databaseClient.release();
        }
    }

    async rollbackWithResponse(databaseClient, res, status, message) {
        await databaseClient.query('ROLLBACK');

        return res.status(status).json({
            error: message
        });
    }

    async getUserById(req, res) {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                error: 'User ID must be a positive integer.'
            });
        }

        try {
            const result = await pool.query(
                `
                    SELECT
                        u."UserID" AS user_id,
                        u."FName" AS first_name,
                        u."LName" AS last_name,
                        u."Email" AS email,
                        r."RoleName" AS role_name,
                        u."CreatedAt" AS created_at
                    FROM "APP_USER" u
                    JOIN "SYSTEM_ROLE" r
                        ON u."RoleID" = r."RoleID"
                    WHERE u."UserID" = $1;
                `,
                [userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: 'User not found.'
                });
            }

            return res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error('Fetching user failed:', error);

            return res.status(500).json({
                error: 'Unable to fetch user.'
            });
        }
    }
}

export default new UserController();
