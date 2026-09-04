// ==========================================
// DACMS USER REGISTRATION API ENDPOINT 
// ==========================================

class UserController {
    /**
     * POST /api/create/user
     * Receives registration data (with pre-hashed password from frontend),
     * and creates an app_user along with their corresponding profile
     * in a single atomic database transaction using a switch-case router.
     */
    async createUser(req, res, pool) {
        // Extract input fields into local camelCase object
        const registrationData = req.body;

        // Map inputs into local snake_case variables
        const first_name = registrationData.f_name;
        const last_name = registrationData.l_name;
        const email_address = registrationData.email;
        const password_hash = registrationData.password; // Pre-hashed password received from the React frontend
        const role_id = parseInt(registrationData.role_id, 10);

        // Basic validation
        if (!first_name || !last_name || !email_address || !password_hash || !role_id) {
            return res.status(400).json({ error: "Missing required core user fields." });
        }

        // Get a client from the pool to handle the transactional workflow
        const database_client = await pool.connect();

        try {
            // Begin safe database transaction
            await database_client.query('BEGIN');

            // 1. Insert into the core app_user table (Using Parameterized Queries for SQL Injection protection)
            const insert_user_query = `
                INSERT INTO app_user (f_name, l_name, email, password_hash, role_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING user_id;
            `;
            const user_insert_values = [first_name, last_name, email_address, password_hash, role_id];
            const user_query_result = await database_client.query(insert_user_query, user_insert_values);
            
            // Extract the generated primary key
            const generated_user_id = user_query_result.rows[0].user_id;

            // 2. Process role-specific profile inserts using a switch-case block
            // Role IDs: 1 = Student, 2 = Lecturer, 3 = Administrator
            switch (role_id) {
                case 1: {
                    // STUDENT PROFILE INSERT
                    const student_number = registrationData.student_number;
                    const study_level = registrationData.study_level; // 'Undergraduate' or 'Postgraduate'
                    const contact_details = registrationData.contact_details;
                    const bank_name = registrationData.bank_name;
                    const account_number = registrationData.account_number;
                    const branch_code = registrationData.branch_code;

                    // Validate student specific fields
                    if (!student_number || !study_level || !contact_details || !bank_name || !account_number || !branch_code) {
                        throw new Error("Missing required student profile fields.");
                    }

                    // Verify check constraint on study level
                    if (study_level !== 'Undergraduate' && study_level !== 'Postgraduate') {
                        throw new Error("Study level must be either 'Undergraduate' or 'Postgraduate'.");
                    }

                    const insert_student_query = `
                        INSERT INTO student_profile (student_number, study_level, contact_details, bank_name, account_number, branch_code, user_id)
                        VALUES ($1, $2, $3, $4, $5, $6, $7);
                    `;
                    const student_values = [
                        student_number,
                        study_level,
                        contact_details,
                        bank_name,
                        account_number,
                        branch_code,
                        generated_user_id
                    ];
                    await database_client.query(insert_student_query, student_values);
                    break;
                }

                case 2: {
                    // LECTURER PROFILE INSERT
                    const lecturer_department = registrationData.department;

                    if (!lecturer_department) {
                        throw new Error("Missing department for lecturer profile.");
                    }

                    const insert_lecturer_query = `
                        INSERT INTO lecturer_profile (department, user_id)
                        VALUES ($1, $2);
                    `;
                    const lecturer_values = [lecturer_department, generated_user_id];
                    await database_client.query(insert_lecturer_query, lecturer_values);
                    break;
                }

                case 3: {
                    // ADMINISTRATOR PROFILE INSERT
                    const mfa_enabled = registrationData.mfa_enabled === true;
                    const budget_rights = registrationData.budget_allocation_rights !== false; // Defaults to true

                    const insert_admin_query = `
                        INSERT INTO administrator_profile (mfa_enabled, budget_allocation_rights, user_id)
                        VALUES ($1, $2);
                    `;
                    const admin_values = [mfa_enabled, budget_rights, generated_user_id];
                    await database_client.query(insert_admin_query, admin_values);
                    break;
                }

                default:
                    throw new Error("Invalid Role ID supplied.");
            }

            // Commit transaction if all inserts succeed
            await database_client.query('COMMIT');

            // Send successful response
            res.status(201).json({
                message: "User and role profile created successfully!",
                user_id: generated_user_id,
                email: email_address,
                role_id: role_id
            });

        } catch (transaction_error) {
            // Roll back database changes if any step fails
            await database_client.query('ROLLBACK');
            console.error("Registration transaction rolled back due to error:", transaction_error.message);
            res.status(500).json({ error: "Registration failed: " + transaction_error.message });
        } finally {
            // Return client connection back to the database pool
            database_client.release();
        }
    }
}

module.exports = new UserController();
