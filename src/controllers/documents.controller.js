
import mongoose from "mongoose";
import { DocumentsService } from "../services/index.js";
import cloudinary from "../../config/cloudinary.js";
import { getPublicIdFromUrl } from "../utills/deletingFromCloud.js";
import { uploadToCloudinary } from "../utills/uploadToCloudinary.js";


// export const addDocument = async (req, res) => {
//     try {
//         const { employee_id, document_type } = req.body;

//         if (!employee_id || !document_type) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Employee ID and document type are required",
//             });
//         }

//         if (!req.files?.document?.length) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please upload a document",
//             });
//         }

//         const file = req.files.document[0];

//         const uploadedFile = await uploadToCloudinary(file.buffer);

//         const document = await DocumentsService.createDocument({
//             employee_id,
//             document_type,
//             document_name: `${document_type}_${employee_id}`.replace(/\s+/g, "_"),
//             document_url: uploadedFile.url,
//         });

//         return res.status(201).json({
//             success: true,
//             message: "Document added successfully",
//             data: document,
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// }


export const deleteDocument = async (req, res) => {

    try {
        const { document_id } = req.body;

        console.log(document_id)

        //Check if id is provided or not
        if (!document_id) {
            return res.status(400).json({
                success: false,
                Message: "Documnet Id not found",
            })
        }
        //Checking if id is valid or not
        if (!mongoose.Types.ObjectId.isValid(document_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Document ID",
            });
        }
        // gretting the documnet
        const document = await DocumentsService.getByDocumnetId(document_id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }



        // Getting Public id from URL and delete from cloud.\
        const publicId = getPublicIdFromUrl(document.document_url);
        console.log(publicId)
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "raw",

        });
        console.log("result:", result);

        // Deleting the Document
        const deleted_document =
            await DocumentsService.deleteByDocumnentId(document_id);


        return res.status(200).json({
            success: true,
            Message: "Document Deleted Successfully.",
            data: deleted_document
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            Message: "Error while deleting Document" + error

        })
    }
}