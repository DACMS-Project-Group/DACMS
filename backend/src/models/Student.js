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

        // Existing extended fields
        id_passport_number,
        title,
        gender,
        date_of_birth,
        income_tax_number,
        sa_citizen,
        residential_address,
        postal_address,
        next_of_kin_name,
        next_of_kin_mobile,
        highest_qualification,
        account_type,
        account_holder_name,

        // Added for StudentProfile.jsx (P&C122F) full-form coverage
        initials,
        middle_names,
        nick_name,
        race,
        marital_status,
        previous_surname,
        home_language,
        preference_language,
        disability,
        primary_employment_outside,
        student_type,
        nationality,
        country_of_birth,
        country_of_passport_issue,
        permit_number,
        currently_employed_by_nwu,
        oe_code_and_name_1,
        job_name_1,
        oe_code_and_name_2,
        job_name_2,

        next_of_kin_title,
        next_of_kin_initials,
        next_of_kin_surname,
        next_of_kin_relationship,
        next_of_kin_daytime_phone_no,
        is_next_of_kin_nwu_employee,
        next_of_kin_nwu_number,

        res_unit_no,
        res_complex,
        res_street_no,
        res_street_name,
        res_suburb,
        res_town_city,
        res_postal_code,
        same_as_residential,
        po_box_no,
        private_bag_no,
        post_office_branch,
        mailing_postal_code,
        work_phone_no,

        qualification_institution,
        qualification_type,
        qualification_status,
        qualification_awarded_date,

        account_holder_relationship,

        declaration_initials_surname,
        declaration_date,
        declaration_agreed,
        signature,
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

        this.initials = initials;
        this.middle_names = middle_names;
        this.nick_name = nick_name;
        this.race = race;
        this.marital_status = marital_status;
        this.previous_surname = previous_surname;
        this.home_language = home_language;
        this.preference_language = preference_language;
        this.disability = disability;
        this.primary_employment_outside = primary_employment_outside;
        this.student_type = student_type;
        this.nationality = nationality;
        this.country_of_birth = country_of_birth;
        this.country_of_passport_issue = country_of_passport_issue;
        this.permit_number = permit_number;
        this.currently_employed_by_nwu = currently_employed_by_nwu;
        this.oe_code_and_name_1 = oe_code_and_name_1;
        this.job_name_1 = job_name_1;
        this.oe_code_and_name_2 = oe_code_and_name_2;
        this.job_name_2 = job_name_2;

        this.next_of_kin_title = next_of_kin_title;
        this.next_of_kin_initials = next_of_kin_initials;
        this.next_of_kin_surname = next_of_kin_surname;
        this.next_of_kin_relationship = next_of_kin_relationship;
        this.next_of_kin_daytime_phone_no = next_of_kin_daytime_phone_no;
        this.is_next_of_kin_nwu_employee = is_next_of_kin_nwu_employee;
        this.next_of_kin_nwu_number = next_of_kin_nwu_number;

        this.res_unit_no = res_unit_no;
        this.res_complex = res_complex;
        this.res_street_no = res_street_no;
        this.res_street_name = res_street_name;
        this.res_suburb = res_suburb;
        this.res_town_city = res_town_city;
        this.res_postal_code = res_postal_code;
        this.same_as_residential = same_as_residential;
        this.po_box_no = po_box_no;
        this.private_bag_no = private_bag_no;
        this.post_office_branch = post_office_branch;
        this.mailing_postal_code = mailing_postal_code;
        this.work_phone_no = work_phone_no;

        this.qualification_institution = qualification_institution;
        this.qualification_type = qualification_type;
        this.qualification_status = qualification_status;
        this.qualification_awarded_date = qualification_awarded_date;

        this.account_holder_relationship = account_holder_relationship;

        this.declaration_initials_surname = declaration_initials_surname;
        this.declaration_date = declaration_date;
        this.declaration_agreed = declaration_agreed;
        this.signature = signature;
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

            initials: row.Initials,
            middle_names: row.MiddleNames,
            nick_name: row.NickName,
            race: row.Race,
            marital_status: row.MaritalStatus,
            previous_surname: row.PreviousSurname,
            home_language: row.HomeLanguage,
            preference_language: row.PreferenceLanguage,
            disability: row.Disability,
            primary_employment_outside: row.PrimaryEmploymentOutside,
            student_type: row.StudentType,
            nationality: row.Nationality,
            country_of_birth: row.CountryOfBirth,
            country_of_passport_issue: row.CountryOfPassportIssue,
            permit_number: row.PermitNumber,
            currently_employed_by_nwu: row.CurrentlyEmployedByNwu,
            oe_code_and_name_1: row.OeCodeAndName1,
            job_name_1: row.JobName1,
            oe_code_and_name_2: row.OeCodeAndName2,
            job_name_2: row.JobName2,

            next_of_kin_title: row.NextOfKinTitle,
            next_of_kin_initials: row.NextOfKinInitials,
            next_of_kin_surname: row.NextOfKinSurname,
            next_of_kin_relationship: row.NextOfKinRelationship,
            next_of_kin_daytime_phone_no: row.NextOfKinDaytimePhoneNo,
            is_next_of_kin_nwu_employee: row.IsNextOfKinNwuEmployee,
            next_of_kin_nwu_number: row.NextOfKinNwuNumber,

            res_unit_no: row.ResUnitNo,
            res_complex: row.ResComplex,
            res_street_no: row.ResStreetNo,
            res_street_name: row.ResStreetName,
            res_suburb: row.ResSuburb,
            res_town_city: row.ResTownCity,
            res_postal_code: row.ResPostalCode,
            same_as_residential: row.SameAsResidential,
            po_box_no: row.PoBoxNo,
            private_bag_no: row.PrivateBagNo,
            post_office_branch: row.PostOfficeBranch,
            mailing_postal_code: row.MailingPostalCode,
            work_phone_no: row.WorkPhoneNo,

            qualification_institution: row.QualificationInstitution,
            qualification_type: row.QualificationType,
            qualification_status: row.QualificationStatus,
            qualification_awarded_date: row.QualificationAwardedDate,

            account_holder_relationship: row.AccountHolderRelationship,

            declaration_initials_surname: row.DeclarationInitialsSurname,
            declaration_date: row.DeclarationDate,
            declaration_agreed: row.DeclarationAgreed,
            signature: row.Signature,
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

            Initials: this.initials,
            MiddleNames: this.middle_names,
            NickName: this.nick_name,
            Race: this.race,
            MaritalStatus: this.marital_status,
            PreviousSurname: this.previous_surname,
            HomeLanguage: this.home_language,
            PreferenceLanguage: this.preference_language,
            Disability: this.disability,
            PrimaryEmploymentOutside: this.primary_employment_outside,
            StudentType: this.student_type,
            Nationality: this.nationality,
            CountryOfBirth: this.country_of_birth,
            CountryOfPassportIssue: this.country_of_passport_issue,
            PermitNumber: this.permit_number,
            CurrentlyEmployedByNwu: this.currently_employed_by_nwu,
            OeCodeAndName1: this.oe_code_and_name_1,
            JobName1: this.job_name_1,
            OeCodeAndName2: this.oe_code_and_name_2,
            JobName2: this.job_name_2,

            NextOfKinTitle: this.next_of_kin_title,
            NextOfKinInitials: this.next_of_kin_initials,
            NextOfKinSurname: this.next_of_kin_surname,
            NextOfKinRelationship: this.next_of_kin_relationship,
            NextOfKinDaytimePhoneNo: this.next_of_kin_daytime_phone_no,
            IsNextOfKinNwuEmployee: this.is_next_of_kin_nwu_employee,
            NextOfKinNwuNumber: this.next_of_kin_nwu_number,

            ResUnitNo: this.res_unit_no,
            ResComplex: this.res_complex,
            ResStreetNo: this.res_street_no,
            ResStreetName: this.res_street_name,
            ResSuburb: this.res_suburb,
            ResTownCity: this.res_town_city,
            ResPostalCode: this.res_postal_code,
            SameAsResidential: this.same_as_residential,
            PoBoxNo: this.po_box_no,
            PrivateBagNo: this.private_bag_no,
            PostOfficeBranch: this.post_office_branch,
            MailingPostalCode: this.mailing_postal_code,
            WorkPhoneNo: this.work_phone_no,

            QualificationInstitution: this.qualification_institution,
            QualificationType: this.qualification_type,
            QualificationStatus: this.qualification_status,
            QualificationAwardedDate: this.qualification_awarded_date,

            AccountHolderRelationship: this.account_holder_relationship,

            DeclarationInitialsSurname: this.declaration_initials_surname,
            DeclarationDate: this.declaration_date,
            DeclarationAgreed: this.declaration_agreed,
            Signature: this.signature,
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

        // The many additional profile fields are intentionally NOT required
        // here - the profile fills in progressively, not all at once.
    }
}

export default Student;