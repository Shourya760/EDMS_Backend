import { ManagerService, EmployeeService, DepartmentService } from "../services/index.js";
import { managerAssignedEmail } from "../emailTamplates/managerMails.js";
import { sendEmail } from "../utills/sendEmail.js";



export const createManager = async (req, res) => {
    try {
        const { department_id, employee_id } = req.body;

        if (!department_id || !employee_id) {
            return res.status(400).json({
                success: false,
                message: "Department and employee are required.",
            });
        }

        const [department, employee] = await Promise.all([
            DepartmentService.getDepartmentById(department_id),
            EmployeeService.getemployeebyid(employee_id),
        ]);
        if (!department || !employee) {
            return res.status(404).json({
                success: false,
                message: "Department or active employee not found.",
            });
        }

        // Check if employee is already a manager
        const existingManager =
            await ManagerService.findByEmployeeId(employee_id);

        if (existingManager) {
            return res.status(400).json({
                success: false,
                message: "Employee is already a manager.",
            });
        }

        // Check if department already has a manager
        const existingDepartment =
            await ManagerService.findByDepartmentId(department_id);

        if (existingDepartment) {
            return res.status(400).json({
                success: false,
                message: "Department already has a manager.",
            });
        }

        // Create manager
        const manager = await ManagerService.createManager({
            department_id,
            employee_id,
        });

        // Update employee
        await EmployeeService.updateEmployee(employee_id, {
            is_manager: true,
        });

        // Update department
        await DepartmentService.updateDepartment(department_id, {
            department_manager_id: employee_id,
        });

        // Send manager assignment email
        try {
            const assignedEmployee =
                await EmployeeService.getemployeebyid(employee_id);

            const assignedDepartment =
                await DepartmentService.getDepartmentById(department_id);
            
            if (assignedEmployee?.email) {
                const emailInfo = managerAssignedEmail(
                    assignedEmployee,
                    assignedDepartment
                );
                await sendEmail({
                    to: assignedEmployee.email,
                    subject: emailInfo.subject,
                    text: emailInfo.text,
                    html: emailInfo.html,
                });

                console.log("✅ Manager assignment email sent");
            } else {
                console.log("⚠️ Employee email not found");
            }

        } catch (emailError) {
            // Email failure should not undo manager creation
            console.error(
                "❌ Failed to send manager assignment email:",
                emailError
            );
        }

        return res.status(200).json({
            success: true,
            message: "Manager created successfully",
            data: manager,
        });

    } catch (error) {
        console.error(
            "Got error while creating a manager:",
            error
        );

        return res.status(400).json({
            success: false,
            message: "Got error while creating a manager.",
        });
    }
};

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


export const removeManager = async (req, res) => {
    try {
        const { manager_id } = req.body;
        console.log("manager ", manager_id);


        const manager = await ManagerService.findByManagerId(manager_id);
        console.log("manager ", manager);

        if (!manager) {
            return res.status(400).json({
                success: false,
                message: " Manager not found "
            })
        }

        const employee_id = manager.employee_id;

        await DepartmentService.updateDepartment(manager.department_id, {
            department_manager_id: null
        })
        await EmployeeService.updateEmployee(employee_id, {
            is_manager: false
        })

        const manager_map_deleted = await ManagerService.removeByManagerId(manager_id);

        return res.status(200).json({
            success: true,
            message: "Manager Removed Successfully",
            data: manager_map_deleted
        });



    } catch (error) {
        return res.status(400).json({
            success: false,
            message: " ❌ Error while removing  managers => " + error
        })
    }
}
