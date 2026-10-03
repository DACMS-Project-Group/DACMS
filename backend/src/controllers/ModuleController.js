import ModuleService from "../services/ModuleService.js";
import { getAuthUserId } from '../utils/getAuthUserId.js';

class ModuleController {
    static async getModulesByLecturer(req, res) {
        try {
            const lecturer_id = getAuthUserId(req);
            const modules = await ModuleService.getModulesByLecturer(lecturer_id);
            return res.status(200).json(modules);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
export default ModuleController;