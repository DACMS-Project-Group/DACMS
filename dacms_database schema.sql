-- ==========================================
-- DACMS DATABASE SCHEMA ONLY SCRIPT
-- Target Platform: PostgreSQL
-- ==========================================

-- Drop tables in reverse order to clean database
DROP TABLE IF EXISTS security_token CASCADE;
DROP TABLE IF EXISTS notification CASCADE;
DROP TABLE IF EXISTS work_session CASCADE;
DROP TABLE IF EXISTS remuneration_claim CASCADE;
DROP TABLE IF EXISTS demi_position CASCADE;
DROP TABLE IF EXISTS demi_application CASCADE;
DROP TABLE IF EXISTS demi_listing CASCADE;
DROP TABLE IF EXISTS student_module_grade CASCADE;
DROP TABLE IF EXISTS module_budget CASCADE;
DROP TABLE IF EXISTS lecturer_module CASCADE;
DROP TABLE IF EXISTS nwu_module CASCADE;
DROP TABLE IF EXISTS supporting_document CASCADE;
DROP TABLE IF EXISTS administrator_profile CASCADE;
DROP TABLE IF EXISTS lecturer_profile CASCADE;
DROP TABLE IF EXISTS student_profile CASCADE;
DROP TABLE IF EXISTS app_user CASCADE;
DROP TABLE IF EXISTS payment_scale CASCADE;
DROP TABLE IF EXISTS system_role CASCADE;

-- Create system roles table
CREATE TABLE system_role (
    role_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_name VARCHAR(20) NOT NULL UNIQUE
);

-- Create payment scales table for university hourly rates
CREATE TABLE payment_scale (
    scale_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_level VARCHAR(50) NOT NULL,
    standard_hourly_rate DECIMAL(8, 2) NOT NULL,
    effective_year INT NOT NULL
);

-- Create application users table with credentials
CREATE TABLE app_user (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    f_name VARCHAR(100) NOT NULL,
    l_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL REFERENCES system_role(role_id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create student profiles table linked to users
CREATE TABLE student_profile (
    student_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_number VARCHAR(15) NOT NULL UNIQUE,
    study_level VARCHAR(20) NOT NULL CHECK (study_level IN ('Undergraduate', 'Postgraduate')),
    contact_details VARCHAR(50) NOT NULL,
    bank_name VARCHAR(50) NOT NULL,
    account_number VARCHAR(30) NOT NULL,
    branch_code VARCHAR(10) NOT NULL,
    user_id INT NOT NULL UNIQUE REFERENCES app_user(user_id) ON DELETE CASCADE
);

-- Create lecturer profiles table linked to users
CREATE TABLE lecturer_profile (
    lecturer_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    department VARCHAR(100) NOT NULL,
    user_id INT NOT NULL UNIQUE REFERENCES app_user(user_id) ON DELETE CASCADE
);

-- Create administrator profiles table linked to users
CREATE TABLE administrator_profile (
    admin_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    budget_allocation_rights BOOLEAN DEFAULT TRUE,
    user_id INT NOT NULL UNIQUE REFERENCES app_user(user_id) ON DELETE CASCADE
);

-- Create supporting documents table for uploads
CREATE TABLE supporting_document (
    document_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id INT NOT NULL REFERENCES student_profile(student_id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    upload_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    document_status VARCHAR(20) DEFAULT 'Pending' CHECK (document_status IN ('Pending', 'Approved', 'Rejected')),
    rejection_reason VARCHAR(255) NULL
);

-- Create academic modules table
CREATE TABLE nwu_module (
    module_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    module_code VARCHAR(10) NOT NULL UNIQUE,
    module_name VARCHAR(100) NOT NULL,
    description TEXT,
    min_academic_requirement DECIMAL(4, 2) NOT NULL DEFAULT 65.00
);

-- Create junction table for lecturers and modules
CREATE TABLE lecturer_module (
    lecturer_id INT NOT NULL REFERENCES lecturer_profile(lecturer_id) ON DELETE CASCADE,
    module_id INT NOT NULL REFERENCES nwu_module(module_id) ON DELETE CASCADE,
    PRIMARY KEY (lecturer_id, module_id)
);

-- Create module budgets table for school accounts
CREATE TABLE module_budget (
    budget_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    module_id INT NOT NULL REFERENCES nwu_module(module_id) ON DELETE CASCADE,
    lecturer_id INT NOT NULL REFERENCES lecturer_profile(lecturer_id) ON DELETE CASCADE,
    allocated_budget DECIMAL(10, 2) NOT NULL,
    current_budget_usage DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    max_allowable_work_hours INT NOT NULL,
    academic_year INT NOT NULL,
    CONSTRAINT unique_module_year_budget UNIQUE (module_id, academic_year)
);

-- Create academic grades table for students
CREATE TABLE student_module_grade (
    grade_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id INT NOT NULL REFERENCES student_profile(student_id) ON DELETE CASCADE,
    module_id INT NOT NULL REFERENCES nwu_module(module_id) ON DELETE CASCADE,
    grade_achieved DECIMAL(5, 2) NOT NULL CHECK (grade_achieved BETWEEN 0.00 AND 100.00),
    CONSTRAINT unique_student_grade UNIQUE (student_id, module_id)
);

-- Create listings table for open tutor slots
CREATE TABLE demi_listing (
    listing_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    module_id INT NOT NULL REFERENCES nwu_module(module_id) ON DELETE CASCADE,
    lecturer_id INT NOT NULL REFERENCES lecturer_profile(lecturer_id) ON DELETE CASCADE,
    deadline TIMESTAMPTZ NOT NULL,
    minimum_grade DECIMAL(5, 2) NOT NULL DEFAULT 65.00
);

-- Create applications table for student signups
CREATE TABLE demi_application (
    application_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id INT NOT NULL REFERENCES student_profile(student_id) ON DELETE CASCADE,
    listing_id INT NOT NULL REFERENCES demi_listing(listing_id) ON DELETE CASCADE,
    application_status VARCHAR(20) DEFAULT 'Pending' CHECK (application_status IN ('Pending', 'Recommended', 'Approved', 'Rejected', 'Revised')),
    verification_eligibility_status VARCHAR(20) DEFAULT 'Pending' CHECK (verification_eligibility_status IN ('Pending', 'Eligible', 'Ineligible')),
    date_submitted TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_listing_app UNIQUE (student_id, listing_id)
);

-- Create positions table for active tutor contracts
CREATE TABLE demi_position (
    position_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    application_id INT NOT NULL UNIQUE REFERENCES demi_application(application_id) ON DELETE CASCADE,
    payment_scale_id INT NOT NULL REFERENCES payment_scale(scale_id),
    start_date DATE NOT NULL,
    termination_date DATE NOT NULL
);

-- Create claims table for monthly payments
CREATE TABLE remuneration_claim (
    claim_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    claim_reference_number VARCHAR(50) NOT NULL UNIQUE,
    application_id INT NOT NULL REFERENCES demi_application(application_id) ON DELETE CASCADE,
    module_id INT NOT NULL REFERENCES nwu_module(module_id),
    total_hours_claimed DECIMAL(5, 2) NOT NULL,
    total_claim_amount DECIMAL(10, 2) NOT NULL,
    hourly_rate_applied DECIMAL(10, 2) NOT NULL,
    claim_status VARCHAR(20) DEFAULT 'Pending' CHECK (claim_status IN ('Pending', 'Approved', 'Rejected', 'Paid')),
    submission_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create timesheets table for logging work
CREATE TABLE work_session (
    session_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id INT NOT NULL REFERENCES student_profile(student_id) ON DELETE CASCADE,
    module_id INT NOT NULL REFERENCES nwu_module(module_id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    total_hours_worked DECIMAL(5, 2) NOT NULL CHECK (total_hours_worked > 0),
    estimated_remuneration DECIMAL(8, 2) NOT NULL,
    lecturer_approval BOOLEAN DEFAULT FALSE,
    claim_id INT NULL REFERENCES remuneration_claim(claim_id) ON DELETE SET NULL,
    CONSTRAINT validate_session_times CHECK (end_time > start_time)
);

-- Create system notifications table
CREATE TABLE notification (
    notification_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    recipient_user_id INT NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create security tokens table for sessions
CREATE TABLE security_token (
    token_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    jwt_token TEXT NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL
);
