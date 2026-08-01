import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
    {
        department_name: {
            type: String,
            required: true,
        },
        department_description: {
            type: String,
            required: true,
        },
        department_manager_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
        }
    },
    {
        timestamps: true,
    }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;