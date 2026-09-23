import User from "./User.js";

class Student extends User {
    constructor({
        user_id = null,
        first_name,
        last_name,
        email,
        password_hash,
        role_id,
        created_at = new Date(),
        student_id = user_id,
        student_number,
        study_level,
        contact_details,
        bank_name = null,
        account_number,
        branch_code,
        id_passport_number = null,
        title = null,
        gender = null,
        date_of_birth = null,
        income_tax_number = null,
        sa_citizen = null,
        residential_address = null,
        postal_address = null,
        next_of_kin_name = null,
        next_of_kin_mobile = null,
        highest_qualification = null,
        account_type = null,
        account_holder_name = null,
    }) {
        super({
            user_id,
            first_name,
            last_name,
            email,
            password_hash,
            role_id,
            created_at
        });

        this.student_id = student_id ?? user_id;
        this.student_number = student_number;
        this.study_level = study_level;
        this.contact_details = contact_details;
        this.bank_name = bank_name;
        this.account_number = account_number;
        this.branch_code = branch_code;

        this.id_passport_number = id_passport_number;
        this.title = title;
        this.gender = gender;
        this.date_of_birth = date_of_birth;
        this.income_tax_number = income_tax_number;
        this.sa_citizen = sa_citizen;
        this.residential_address = residential_address;
        this.postal_address = postal_address;
        this.next_of_kin_name = next_of_kin_name;
        this.next_of_kin_mobile = next_of_kin_mobile;
        this.highest_qualification = highest_qualification;
        this.account_type = account_type;
        this.account_holder_name = account_holder_name;
    }

    static fromDb(row) {
        return new Student({
            user_id: row.UserID ?? row.StudentID,
            student_id: row.StudentID ?? row.UserID,
            first_name: row.FName,
            last_name: row.LName,
            email: row.Email,
            password_hash: row.PasswordHash,
            role_id: row.RoleID,
            created_at: row.CreatedAt ?? row.created_at,
            student_number: row.StudentNumber,
            study_level: row.StudyLevel,
            contact_details: row.ContactDetails,
            bank_name: row.BankName,
            account_number: row.AccountNumber,
            branch_code: row.BranchCode,
            id_passport_number: row.ID_PassportNumber,
            title: row.Title,
            gender: row.Gender,
            date_of_birth: row.DateOfBirth,
            income_tax_number: row.IncomeTaxNumber,
            sa_citizen: row.SACitizen,
            residential_address: row.ResidentialAddress,
            postal_address: row.PostalAddress,
            next_of_kin_name: row.NextOfKinName,
            next_of_kin_mobile: row.NextOfKinMobile,
            highest_qualification: row.HighestQualification,
            account_type: row.AccountType,
            account_holder_name: row.AccountHolderName,
        });
    }

    toDb() {
        return {
            ...super.toDb(),
            StudentID: this.student_id ?? this.user_id,
            StudentNumber: this.student_number,
            StudyLevel: this.study_level,
            ContactDetails: this.contact_details,
            BankName: this.bank_name,
            AccountNumber: this.account_number,
            BranchCode: this.branch_code,
            ID_PassportNumber: this.id_passport_number,
            Title: this.title,
            Gender: this.gender,
            DateOfBirth: this.date_of_birth,
            IncomeTaxNumber: this.income_tax_number,
            SACitizen: this.sa_citizen,
            ResidentialAddress: this.residential_address,
            PostalAddress: this.postal_address,
            NextOfKinName: this.next_of_kin_name,
            NextOfKinMobile: this.next_of_kin_mobile,
            HighestQualification: this.highest_qualification,
            AccountType: this.account_type,
            AccountHolderName: this.account_holder_name,
        };
    }

    validate() {
        super.validate();

        if (!this.student_number || this.student_number.trim() === "") {
            throw new Error("Student number is required.");
        }

        if (!this.study_level || this.study_level.trim() === "") {
            throw new Error("Study level is required.");
        }

        if (!this.contact_details || this.contact_details.trim() === "") {
            throw new Error("Contact details are required.");
        }

        if (!this.account_number || this.account_number.trim() === "") {
            throw new Error("Account number is required.");
        }

        if (!this.branch_code || this.branch_code.trim() === "") {
            throw new Error("Branch code is required.");
        }
    }
}

export default Student;