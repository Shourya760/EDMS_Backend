import { response } from "express";
import DepartmentService from "../services/department.service.js";
import Department from "../models/Department.js";

export const createDepartment = async (req, res) => {

    try {
        // console.log("debbuger 1")
        const { department_description, department_name} = req.body;
        console.log("debbuger 2")
        if (!department_description || !department_name ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        // console.log("debugg 3..")
        const created_department = await DepartmentService.createDepartment({ department_description, department_name });

        return res.status(200).json({
            success: true,
            message: "Department Created Successfully"
        })

    } catch (error) {

        console.log("Error while Creating Department", error);
        return res.status(500).json({
            success: false,
            message: "Error while Creating Department => " + error
        })
    }
}

export const getalldepartment = async (req, res) => {
    try {

        const Department_data = await DepartmentService.getAllDepartment()
        console.log("All the departments are here.......")

        return res.status(200).json({
            success: true,
            message: "All the departments are here.......",
            Department_count: Department_data.length,
            data: Department_data,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE GETTING DEPARTMENTS DATA => " + error
        })
    }
}