import { Employee } from "../models/index.js";

class EmployeeService {

    async createEmployee(data) {
        return await Employee.create(data);
    }
    async findbyemail(email) {
        return await Employee.findOne({
            email,
            is_deleted: false
        });
    }
    async getallemployee() {
        return await Employee.find({
            is_deleted: false,
        });
    }
    async getemployeebyid(id) {
        return await Employee.findById({
            _id: id,
            is_deleted: false
        });
    }
    async updateEmployee(id, data) {
        return await Employee.findByIdAndUpdate(
            id,
            data,
            { returnDocument: "after" }
        );
    }


}
export default new EmployeeService();