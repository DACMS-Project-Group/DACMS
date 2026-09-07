class StudentModuleGrade {
    constructor ({
        module_id,
        student_id,
        grade_achieved
    }) {
        this.module_id = module_id;
        this.student_id = student_id;
        this.grade_achieved = grade_achieved;
    }

    static fromDb(row) {
        return new StudentModuleGrade({
            module_id: row.ModuleID,
            student_id: row.StudentID,
            grade_achieved: row.GradeAchieved,
        });
    }

    toDb() {
        return {
            ModuleID: this.module_id,
            StudentID: this.student_id,
            GradeAchieved: this.grade_achieved,
        };
    }

    validate() {
        if (!this.module_id) {
            throw new Error("Module ID is required.");
        }

        if (!this.student_id) {
            throw new Error("Student ID is required.");
        }

        if (this.grade_achieved === undefined || this.grade_achieved === null) {
            throw new Error("Grade achieved is required.");
        }
    }
}

export default StudentModuleGrade;