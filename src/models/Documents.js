import mongoose from "mongoose";

const documentsSchema = new mongoose.Schema(
    {
        employee_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
        document_type: {
            type: String,
            required: true,
            enum: [
                "10th Marksheet",
                "12th Marksheet",
                "Aadhar Card",
                "PAN Card",
            ],
        },
        document_name: {
            type: String,
            required: true,
        },
        document_url: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            required: false,
            default: 0
        },
    },
    {
        timestamps: true,
    }
);

const Document = mongoose.model("Document", documentsSchema);

export default Document;