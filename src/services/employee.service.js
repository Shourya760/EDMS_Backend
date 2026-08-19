import { Employee } from "../models/index.js";

class EmployeeService {

    async createEmployee(data) {
        return await Employee.create(data);
    }
    async findbyemail(email) {
        // Email has a database-level unique index, so soft-deleted employees
        // must also be considered during duplicate checks.
        return await Employee.findOne({ email });
    }
    async getallemployee() {
        return await Employee.find({
            is_deleted: false,
        });
    }
    async getemployeebyid(id) {
        return await Employee.findOne({ _id: id, is_deleted: false });
    }
    async updateEmployee(id, data) {
        return await Employee.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );
    }

    async getRecentThreeEmoloyees() {
        return await Employee.find({ is_deleted: false })
            .sort({ createdAt: -1 })
            .limit(3);
    }


    async createManyEmployees(employees) {
        return await Employee.insertMany(employees);
    };

}
export default new EmployeeService();
