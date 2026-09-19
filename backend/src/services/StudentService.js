import StudentRepository from '../repositories/StudentRepository.js';

class StudentService {
    constructor() {
        this.studentRepository = new StudentRepository();
    }

    async getProfile(userId) {
        const student = await this.studentRepository.findByUserId(userId);
        if (!student) {
            throw new Error('Student profile not found.');
        }
        return student;
    }

    async updateProfile(userId, updates) {
        const existing = await this.studentRepository.findByUserId(userId);
        if (!existing) {
            throw new Error('Student profile not found.');
        }
        return this.studentRepository.updateProfile(userId, updates);
    }
}

export default new StudentService();
