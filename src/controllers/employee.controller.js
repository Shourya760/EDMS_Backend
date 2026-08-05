import { isValidIndianPhone } from "../utills/validations.js";
import { DepartmentService, DocumentsService, EmployeeService, ManagerService } from "../services/index.js";
import { uploadToCloudinary } from "../utills/uploadToCloudinary.js";
import documentService from "../services/document.service.js";


export const createEmployee = async (req, res) => {
    try {
        const { name,
            email,
            phone,
            designation,
            address,
            status,
            joining_date,
            documentTypes
        } = req.body;

        console.log("FILE TYPE OF REQ.FILE: ", req.files);
        console.log("BODY :  ", documentTypes);

        // checking if all the field are entered
        if (!name || !email || !phone || !designation || !address || !joining_date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // check for wrong phone number
        const check_phone_error = isValidIndianPhone(phone);
        if (!check_phone_error) {
            return res.status(409).json({
                success: false,
                message: "Invalid phone number ",
            });
        }

        // check is email already exists
        const email_exist_check = await EmployeeService.findbyemail(email);
        if (email_exist_check) {
            return res.status(400).json({
                success: false,
                message: "Email already Exists in DB"
            });
        }

        // profile Photo upload
        let documentUrl = "";
        if (req.files?.profile_image) {
            const uploadedFile = await uploadToCloudinary(req.files.profile_image[0].buffer);
            documentUrl = uploadedFile.url
        }
        // creting user in DB
        const employee = await EmployeeService.createEmployee({
            name,
            email,
            phone,
            designation,
            address,
            status,
            joining_date,
            profile_image: documentUrl
        });


        // Store Employee Documents:
        const parsedDocumentTypes = documentTypes
            ? JSON.parse(documentTypes)
            : [];

        const uploadedDocuments = req.files.documents || [];
        const employeeDocuments = await Promise.all(

            uploadedDocuments.map(async (file, index) => {

                const fileName = `${parsedDocumentTypes[index].type}_${employee.email}`
                    .replace(/\s+/g, "_");

                const uploadedFile = await uploadToCloudinary(file.buffer);

                return {
                    employee_id: employee._id,
                    document_type: parsedDocumentTypes[index].type,
                    document_name: fileName,
                    document_url: uploadedFile.url
                };
            })
        );
        // creating documents in DB
        const document = await DocumentsService.createDocument(
            employeeDocuments
        )

        // All done
        return res.status(200).json({
            success: true,
            message: "Employeee registered successfully",
            data: {
                id: employee._id,
                name: employee.name,
                email: employee.email,
            },
        });
    } catch (error) {
        console.log("Error while creating employee => ", error)
        return res.status(500).json({
            success: false,
            message: "Error while creating employee => " + error
        })
    }
}

export const getAllEmployee = async (req, res) => {
    try {
        const data = await EmployeeService.getallemployee()
        console.log("All the Employees are here.......")
        return res.status(200).json({
            success: true,
            message: "Got all employee ",
            data: data,
            total_employee: data.length,

        })

    } catch (error) {
        console.log("Got error while getting employee")
        return res.status(400).json({
            success: false,
            message: "Got error while getting employee => " + error
        })
    }
}

export const getOneEmployee = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            console.log("ID NOT FOUND")
            return res.status(400).json({
                success: false,
                message: "ID NOT FOUND",
            })
        }
        const employee_data = await EmployeeService.getemployeebyid(id);
        const employee_document = await DocumentsService.getDocumentsByEmployeeId(id);

        console.log("Employee Document", employee_document)

        return res.status(200).json({
            success: true,
            message: "GOT THE USER",
            data: { employee_data, employee_document }
        })


    } catch (error) {
        console.log("Error while getting single user data => ", error)
        return res.status(400).json({
            success: false,
            message: "Error while getting single user data => " + error,
        });

    }
}

export const deleteEmployee = async (req, res) => {
    try {
        const { employee_id } = req.body;
        console.log(employee_id)

        // Checking for id 
        if (!employee_id) {
            return res.status(400).json({
                success: false,
                message: "Id not found"
            })
        }
        //Check if employee exists
        const employee = await EmployeeService.getemployeebyid(employee_id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found."
            });
        }
        // Check if already deleted
        if (employee.is_deleted) {
            return res.status(400).json({
                success: false,
                message: "Employee is already deleted."
            });
        }
        //Removing manager_id from department and removing manager record if exist 
        const manager = await ManagerService.findByManagerId(employee_id);
        if (manager) {
            await DepartmentService.updateDepartment(
                manager.department_id,
                {
                    department_manager_id: null,
                }
            );
            console.log("papapapapapapap")

            await ManagerService.removeByEmployeeId(employee_id);
        }

        // Soft Deleting
        const deletedEmployee = await EmployeeService.updateEmployee(
            employee_id,
            {
                is_deleted: true,
                is_manager: false,
                delete_date: new Date(),
            }
        );

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully.",
            data: deletedEmployee,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something wrong while deleting employee =>" + error
        })
    }
}

export const updateEmployee = async (req, res) => {
    try {
        const { employee_id } = req.body;
        const data = JSON.parse(req.body.data);

        if (!employee_id) {
            return res.status(400).json({
                success: false,
                message: "Employee ID not found.",
            });
        }

        // Validate phone number (only if provided)
        if (data.phone) {
            const check_phone_error = isValidIndianPhone(data.phone);

            if (!check_phone_error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid phone number.",
                });
            }
        }

        // Upload new profile image if user selected one
        if (req.files?.profile_image?.length > 0) {
            const uploadedFile = await uploadToCloudinary(
                req.files.profile_image[0].buffer
            );
            data.profile_image = uploadedFile.url;
        }

        // Update employee
        const updatedData = await EmployeeService.updateEmployee(
            employee_id,
            data
        );

        if (!updatedData) {
            return res.status(404).json({
                success: false,
                message: "Employee not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully.",
            employee: updatedData,
        });

    } catch (error) {
        console.log("Update Employee Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};