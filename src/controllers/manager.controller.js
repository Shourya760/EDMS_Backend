import { ManagerService, EmployeeService, DepartmentService } from "../services/index.js";



export const createManager = async (req, res) => {
    try {
        const { department_id, employee_id } = req.body;
        console.log(req.body)


        if (!department_id || !employee_id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required of the manager..",
            });
        };

        const existing_Manager = await ManagerService.findByManagerId(employee_id);
        const existing_Department = await ManagerService.findByDepartmentId(department_id)

        if (existing_Manager) {
            return res.status(400).json({
                success: false,
                message: "Employee is already a manager",
            });
        }
        if (existing_Department) {
            return res.status(400).json({
                success: false,
                message: "Department  already has a manager",
            });
        }
        console.log("dubugg1")

        const manager = await ManagerService.createManager({
            department_id,
            employee_id,
        });

        await EmployeeService.updateEmployee(employee_id, {
            is_manager: true,
        });
        await DepartmentService.updateDepartment(department_id, {
            department_manager_id: employee_id,
        })


        return res.status(200).json({
            success: true,
            message: "Manager created successfully",
            data: manager

        });

    } catch (error) {
        console.log("Got error while creating a manager")
        return res.status(400).json({
            success: false,
            message: "Got error while creating a manager => " + error
        });
    }
}

export const getAllManager = async (req, res) => {
    try {

        const manager = await ManagerService.getAllManagers()


        return res.status(200).json({
            success: true,
            message: "Got all the manager.....🙂",
            length: manager.length,
            data: manager
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error while getting managers => " + error
        })
    }
}

