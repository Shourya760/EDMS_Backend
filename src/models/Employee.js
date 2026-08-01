import mongoose from "mongoose";


const employeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true,
            match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
        },
        designation: {
            type: String,
            required: true,
        },
        profile_image: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: true,
        },
        joining_date: {
            type: Date,
            required: true,
        },
        status: {
            type: Boolean,
            required: true,
            default: 0,
        },
        is_manager: {
            type: Boolean,
            default: 0,
        },
        // soft delete

        is_deleted: {
            type: Boolean,
            default: false
        },
        delete_date: {
            type: Date,
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
