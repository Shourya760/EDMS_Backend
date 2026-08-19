

import { EmployeeService } from "../services/index.js";
import { isValidIndianPhone } from "./validations.js";


export const validateEmployees = async (employees) => {
    const errors = [];
    const uploadedEmails = new Set();

    if (!Array.isArray(employees) || employees.length === 0) {
        return {
            valid: false,
            errors: [{
                row: 1,
                field: "file",
                message: "The uploaded file must contain at least one employee"
            }]
        };
    }

    await Promise.all(employees.map(async (employee, index) => {
        const row = index + 2;

        if (!employee || typeof employee !== "object") {
            errors.push({
                row,
                field: "row",
                message: "Invalid employee row"
            });
            return;
        }

        // Spreadsheet cells can contain numbers, so normalize them before
        // validating and persisting the employee.
        for (const field of ["name", "email", "phone", "designation", "address"]) {
            if (employee[field] !== undefined && employee[field] !== null) {
                employee[field] = String(employee[field]).trim();
            }
        }

        if (employee.email) {
            employee.email = employee.email.toLowerCase();
        }

        if (!employee.name) {
            errors.push({
                row,
                field: "name",
                message: "Name is required"
            });
        }

        if (!employee.email) {
            errors.push({
                row,
                field: "email",
                message: "Email is required"
            });
        }

        if (!employee.phone) {
            errors.push({
                row,
                field: "phone",
                message: "Phone is required"
            });
        }

        if (!employee.designation) {
            errors.push({
                row,
                field: "designation",
                message: "Designation is required"
            });
        }

        if (!employee.address) {
            errors.push({
                row,
                field: "address",
                message: "Address is required"
            });
        }

        if (!employee.joining_date) {
            errors.push({
                row,
                field: "joining_date",
                message: "Joining date is required"
            });
        }

        if (employee.phone && !isValidIndianPhone(employee.phone)) {
            errors.push({
                row,
                field: "phone",
                message: "Invalid phone number"
            });
        }

        if (!employee.email) {
            return;
        }

        if (uploadedEmails.has(employee.email)) {
            errors.push({
                row,
                field: "email",
                message: "Email is duplicated in the uploaded file"
            });
            return;
        }
        uploadedEmails.add(employee.email);

        // Wait for the lookup before returning validation results. The old
        // async forEach did not wait, which allowed duplicate emails through.
        const emailExists = await EmployeeService.findbyemail(employee.email);
        if (emailExists) {
            errors.push({
                row,
                field: "email",
                message: "Email already exists"
            });
        }
    }));

    return {
        valid: errors.length === 0, errors
    };
};
