import mongoose from "mongoose";


const managerSchema = new mongoose.Schema(
    {
        department_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
        employee_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Manager = mongoose.model("Manager", managerSchema);
export default Manager;