import ModuleRepository from '../repositories/ModuleRepository.js';

class ModuleService {
    static async getModules() {
        const { modules } = await ModuleRepository.getModules();
        return modules;
    }

    static async getModulesByLecturer(lecturer_id) {
        if (!lecturer_id) {
            throw new Error('lecturer_id is required.');
        }
        const { modules } = await ModuleRepository.getModulesByLecturer(lecturer_id);
        return modules;
    }
}
export default ModuleService;