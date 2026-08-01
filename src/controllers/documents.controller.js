
import { DocumentsService } from "../services/index.js";
import { uploadToCloudinary } from "../utills/uploadToCloudinary.js";

export const createDocument = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.files);
        const { employee_id, document_type, document_name, document_url } = req.body;

        if (!employee_id || !document_type || !document_name || !document_url) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        };


        const created_documents = await DocumentsService.createDocument({
            employee_id,
            document_type,
            document_name,
            document_url,

        })

        return res.status(200).json({
            success: true,
            message: "Received successfully",
            data: created_documents

        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error uploading Documents =>" + error
        })
    }
}