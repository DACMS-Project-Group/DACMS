import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Lecturer from '../models/Lecturer.js';
import Administrator from '../models/Administrator.js';

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

        if (!password || typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long.'
            });
        }

        let userModel;
        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

        try {
            // Instantiate models using class constructors based on role
            if (roleId === ROLE_IDS.STUDENT) {
                const studyLevel = readRequiredString(body.study_level);
                if (studyLevel && !['Undergraduate', 'Postgraduate'].includes(studyLevel)) {
                    return res.status(400).json({
                        error: 'Study level must be Undergraduate or Postgraduate.'
                    });
                }

                userModel = new Student({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password_hash: hashedPassword,
                    role_id: roleId,
                    student_number: readRequiredString(body.student_number),
                    study_level: studyLevel,
                    contact_details: readRequiredString(body.contact_details),
                    bank_name: readRequiredString(body.bank_name),
                    account_number: readRequiredString(body.account_number),
                    branch_code: readRequiredString(body.branch_code)
                });
            } else if (roleId === ROLE_IDS.LECTURER) {
                userModel = new Lecturer({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password_hash: hashedPassword,
                    role_id: roleId,
                    department: readRequiredString(body.department)
                });
            } else if (roleId === ROLE_IDS.ADMINISTRATOR) {
                userModel = new Administrator({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password_hash: hashedPassword,
                    role_id: roleId,
                    mfa_enabled: body.mfa_enabled ?? true,
                    budget_allocation_rights: body.budget_allocation_rights ?? true
                });
            } else {
                return res.status(400).json({
                    error: 'First name, last name, email, password, and a valid role are required.'
                });
            }

            // Leverage built-in model validation rules
            userModel.validate();
        } catch (valErr) {
            return res.status(400).json({ error: valErr.message });
        }

        const databaseClient = await pool.connect();

        try {
            await databaseClient.query('BEGIN');

            const dbData = userModel.toDb();

            // Insert base user
            const userResult = await databaseClient.query(
                `
                    INSERT INTO "APP_USER"
                        ("FName", "LName", "Email", "PasswordHash", "RoleID")
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING "UserID";
                `,
                [dbData.FName, dbData.LName, dbData.Email, dbData.PasswordHash, dbData.RoleID]
            );

            const userId = userResult.rows[0].UserID;
            userModel.user_id = userId;

            // Insert role-specific database fields
            if (roleId === ROLE_IDS.STUDENT) {
                userModel.student_id = userId;
                await databaseClient.query(
                    `
                        INSERT INTO "STUDENT"
                            ("StudentID", "StudentNumber", "StudyLevel", "ContactDetails", "BankName", "AccountNumber", "BranchCode")
                        VALUES ($1, $2, $3, $4, $5, $6, $7);
                    `,
                    [
                        userId,
                        userModel.student_number,
                        userModel.study_level,
                        userModel.contact_details,
                        userModel.bank_name,
                        userModel.account_number,
                        userModel.branch_code
                    ]
                );
            } else if (roleId === ROLE_IDS.LECTURER) {
                userModel.lecturer_id = userId;
                await databaseClient.query(
                    `
                        INSERT INTO "LECTURER" ("LecturerID", "Department")
                        VALUES ($1, $2);
                    `,
                    [userId, userModel.department]
                );
            } else if (roleId === ROLE_IDS.ADMINISTRATOR) {
                userModel.admin_id = userId;
                await databaseClient.query(
                    `
                        INSERT INTO "ADMINISTRATOR" ("AdminID", "MFA_Enabled", "BudgetAllocationRights")
                        VALUES ($1, $2, $3);
                    `,
                    [userId, userModel.mfa_enabled, userModel.budget_allocation_rights]
                );
            }

            await databaseClient.query('COMMIT');

            return res.status(201).json({
                message: 'User created successfully.',
                user_id: userId,
                email: userModel.email,
                role_id: userModel.role_id
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
                        u."UserID",
                        u."FName",
                        u."LName",
                        u."Email",
                        u."PasswordHash",
                        u."RoleID",
                        u."CreatedAt",
                        r."RoleName"
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

            // Hydrate base domain model using the static `fromDb` mapper
            const user = User.fromDb(result.rows[0]);

            return res.status(200).json({
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                full_name: user.fullName,
                email: user.email,
                role_name: result.rows[0].RoleName,
                created_at: user.created_at
            });
        } catch (error) {
            console.error('Fetching user failed:', error);

            return res.status(500).json({
                error: 'Unable to fetch user.'
            });
        }
    }
}

export default new UserController();