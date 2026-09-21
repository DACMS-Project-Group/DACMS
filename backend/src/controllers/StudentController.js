import studentService from '../services/StudentService.js';
import { getAuthUserId } from '../utils/getAuthUserId.js';

class StudentController {
    async getProfile(req, res, next) {
        try {
            const userId = getAuthUserId(req);
            const student = await studentService.getProfile(userId);
            res.json({ student });
        } catch (err) {
            if (err.message.includes('not found')) {
                return res.status(404).json({ message: err.message });
            }
            next(err);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = getAuthUserId(req);
            const { contactDetails,bankName, accountNumber,branchCode,title,gender,dateOfBirth,residentialAddress,postalAddress,nextOfKinName,nextOfKinMobile} = req.body;

            const student = await studentService.updateProfile(userId, {
                   contactDetails,
                   bankName,
                   accountNumber,
                   branchCode,
                   title,
                   gender,
                   dateOfBirth,
                  residentialAddress,
                  postalAddress,
                  nextOfKinName,
                  nextOfKinMobile
            });

            res.json({ student });
        } catch (err) {
            if (err.message.includes('not found')) {
                return res.status(404).json({ message: err.message });
            }
            next(err);
        }
    }
}

export default new StudentController();
