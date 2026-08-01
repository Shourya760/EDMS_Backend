import { Manager } from "../models/index.js";

class ManagerService {

    async createManager(data) {
        return await Manager.create(data);
    }
    async getAllManagers() {
        return await Manager.find()
            .populate("department_id")
            .populate("employee_id");  //fixx this first.................................
    }
    async findByManagerId(employee_id) {
        return await Manager.findOne({ employee_id });
    }
    async findByDepartmentId(department_id) {
        return await Manager.findOne({ department_id })
    }
    async removeByEmployeeId(employee_id) {
        return await Manager.findOneAndDelete({ employee_id })
    }

}
export default new ManagerService();