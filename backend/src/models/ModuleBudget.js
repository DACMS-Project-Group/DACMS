class ModuleBudget {
    constructor({
        budget_id = null,
        module_id,
        lecturer_id,
        allocated_budget,
        current_budget_usage = 0.00,
        max_allowable_work_hours,
        academic_year,
    }) {
        this.budget_id = budget_id;
        this.module_id = module_id;
        this.lecturer_id = lecturer_id;
        this.allocated_budget = allocated_budget;
        this.current_budget_usage = current_budget_usage;
        this.max_allowable_work_hours = max_allowable_work_hours;
        this.academic_year = academic_year;
    }

    static fromDb(row) {
        return new ModuleBudget({
            budget_id: row.BudgetID,
            module_id: row.ModuleID,
            lecturer_id: row.LecturerID,
            allocated_budget: row.AllocatedBudget,
            current_budget_usage: row.CurrentBudgetUsage,
            max_allowable_work_hours: row.MaxAllowableWorkHours,
            academic_year: row.AcademicYear,
        });
    }

    toDb() {
        return {
            BudgetID: this.budget_id,
            ModuleID: this.module_id,
            LecturerID: this.lecturer_id,
            AllocatedBudget: this.allocated_budget,
            CurrentBudgetUsage: this.current_budget_usage,
            MaxAllowableWorkHours: this.max_allowable_work_hours,
            AcademicYear: this.academic_year,
        };
    }

    validate() {
        if (!this.module_id) throw new Error("Module ID is required.");
        if (!this.lecturer_id) throw new Error("Lecturer ID is required.");
        if (this.allocated_budget == null || isNaN(this.allocated_budget)) {
            throw new Error("Allocated budget must be a valid number.");
        }
        if (this.max_allowable_work_hours == null || isNaN(this.max_allowable_work_hours)) {
            throw new Error("Max allowable work hours must be a valid number.");
        }
        if (!this.academic_year || isNaN(this.academic_year)) {
            throw new Error("Academic year must be a valid integer year.");
        }
    }
}

export default ModuleBudget;