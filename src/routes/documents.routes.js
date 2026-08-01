import express from "express";
import multer from "multer";
import { createDocument } from "../controllers/documents.controller.js";



const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});


router.post("/createdocument", upload.single("document_name"), createDocument)


export default router;