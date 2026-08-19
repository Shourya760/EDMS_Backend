import { isValidIndianPhone } from "../utills/validations.js";
import { DepartmentService, DocumentsService, EmployeeService, ManagerService } from "../services/index.js";
import { uploadToCloudinary } from "../utills/uploadToCloudinary.js";
import { sendEmail } from "../utills/sendEmail.js";
import { employeeWelcomeEmail, employeeDeletedEmail, } from "../emailTamplates/employeeMails.js";
import { importEmployees } from "../utills/importEmployees.js";
import { validateEmployees } from "../utills/validateEmployees.js";


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

        const uploadedDocuments = req.files?.documents || [];
        const employeeDocuments = await Promise.all(

            uploadedDocuments.map(async (file, index) => {

                if (!parsedDocumentTypes[index]?.type) {
                    throw new Error("Each uploaded document needs a document type");
                }
                const fileName = `${parsedDocumentTypes[index].type}_${employee.email}`
                    .replace(/\s+/g, "_");

                const uploadedFile = await uploadToCloudinary(file.buffer);

                return {
                    employee_id: employee._id,
                    document_type: parsedDocumentTypes[index].type,
                    document_name: fileName,
                    document_url: uploadedFile.url,
                };
            })
        );
        console.log(employeeDocuments)
        // creating documents in DB
        const document = await DocumentsService.createDocument(
            employeeDocuments
        )

        // Call Email service to Send Welcome Email to this User.

        if (document && employee) {
            try {
                const emailInfo = employeeWelcomeEmail(employee);

                await sendEmail({
                    to: employee.email,
                    subject: emailInfo.subject,
                    text: emailInfo.text,
                    html: emailInfo.html,
                });

            } catch (error) {
                console.error("Error sending welcome email:", error);
            }

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
        } else {
            return res.status(400).json({
                success: true,
                message: "Error in sending mail..",
            });
        }



    } catch (error) {
        console.log("Error while creating employee => ", error)
        return res.status(500).json({
            success: false,
            message: "Error while creating employee => " + error
        })
    }
}

export const getAllEmployee = async (req, res) => {
    const { recentThree, is_manager } = req.query;

    try {
        if (recentThree === "true") {
            const data = await EmployeeService.getRecentThreeEmoloyees();

            return res.status(200).json({
                success: true,
                message: "Got recent three employees",
                data,
                total_employee: data.length,
            });
        }
        const allEmployees = await EmployeeService.getallemployee();
        let data = allEmployees;

        if (is_manager === "false") {
            data = allEmployees.filter(
                employee => employee.is_manager === false
            );

        } else if (is_manager === "true") {
            data = allEmployees.filter(
                employee => employee.is_manager === true
            );
        }

        return res.status(200).json({
            success: true,
            message: "Got all employees",
            total_employee: data.length,
            data: data,

        });

    } catch (error) {
        console.log("Got error while getting employee", error);

        return res.status(400).json({
            success: false,
            message: "Got error while getting employee",
            error: error.message,
        });
    }
};

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
        const manager = await ManagerService.findByEmployeeId(employee_id);
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



        try {
            const emailInfo = employeeDeletedEmail(employee);

            await sendEmail({
                to: employee.email,
                subject: emailInfo.subject,
                text: emailInfo.text,
                html: emailInfo.html,
            });

        } catch (error) {
            console.error("Error sending employee deletion email:", error);
        }

        // All done
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
        const { employee_id, documentTypes } = req.body;
        const data = JSON.parse(req.body.data);

        if (!employee_id) {
            return res.status(400).json({
                success: false,
                message: "Employee ID not found.",
            });
        }

        // Validate phone
        if (data.phone && !isValidIndianPhone(data.phone)) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number.",
            });
        }

        // Upload profile image
        if (req.files?.profile_image?.length > 0) {
            const uploadedImage = await uploadToCloudinary(
                req.files.profile_image[0].buffer
            );

            data.profile_image = uploadedImage.url;
        }

        // Update employee
        const updatedEmployee = await EmployeeService.updateEmployee(
            employee_id,
            data
        );

        if (!updatedEmployee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found.",
            });
        }

        // ---------------- Documents ----------------

        if (documentTypes) {
            const parsedDocumentTypes = JSON.parse(documentTypes);
            const uploadedDocuments = req.files?.documents || [];

            const employeeDocuments = await Promise.all(
                uploadedDocuments.map(async (file, index) => {

                    const uploadedFile = await uploadToCloudinary(file.buffer);

                    return {
                        employee_id,
                        document_type: parsedDocumentTypes[index].type,
                        document_name: `${parsedDocumentTypes[index].type}_${updatedEmployee.email}`.replace(/\s+/g, "_"),
                        document_url: uploadedFile.url,
                    };
                })
            );

            if (employeeDocuments.length > 0) {
                await DocumentsService.createDocument(employeeDocuments);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully.",
            employee: updatedEmployee,
        });

    } catch (error) {
        console.log("Update Employee Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const createmanyemployee = async (req, res) => {
    try {

        const file = req.file;
        // console.log(file);

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an Excel or CSV file",
            });
        }
        // Extrect JSON
        const result = await importEmployees(file);
        console.log("Emplyees data are  : ", result);




        // Validate JSON
        const validation = await validateEmployees(result);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee data",
                errors: validation.errors
            });
        }


        const empoyees = await EmployeeService.createManyEmployees(result);


        return res.status(200).json({
            success: true,
            message: "Employees imported successfully",
            length: empoyees.length,
            data: empoyees,
        });


    } catch (error) {
        console.log("Update Employee Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while inserting data=>" + error
        });
    }
}
