
import mongoose from "mongoose";
import { DocumentsService } from "../services/index.js";
import cloudinary from "../../config/cloudinary.js";
import { getPublicIdFromUrl } from "../utills/deletingFromCloud.js";





export const getalldocuments = async (req, res) => {
    try {
        console.log("Welcome ")
        const document = await DocumentsService.getAllDocuments();

        return res.status(201).json({
            success: true,
            message: "Got all documents",
            length: document.length,
            data: document
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in getting documnets" + error
        });
    }
}

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

export const verifyDocument = async (req, res) => {
    try {
        const curr_user = req.curr_user;
        const { document_id, verification_status } = req.body;


        console.log("curr_user:", curr_user)
        console.log("document_id:", document_id)


        if (!document_id) {
            return res.status(400).json({
                success: false,
                message: "document_id is required"
            });
        }

        const data = {
            verification_status: verification_status,
            verified_by: curr_user.id,
            verification_date: new Date()
        };

        // console.log("data", data);

        const updating_verification = await DocumentsService.updateDocumnetsByDocumentId(document_id, data);


        return res.status(200).json({
            success: true,
            message: " Verification Done",
            data: updating_verification
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error in Verification" + error
        });
    }
}