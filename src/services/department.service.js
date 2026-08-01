import { Department } from "../models/index.js";

class DepartmentService {

    async createDepartment(data) {
        return await Department.create(data);
    }

    async getAllDepartment() {
        return await Department.find()
            .populate("department_manager_id");
    }
    async updateDepartment(id, data) {
        return await Department.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );
    }
    

}

export default new DepartmentService;
