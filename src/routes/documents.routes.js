import express from "express";
import multer from "multer";
import { createDocument, } from "../controllers/documents.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";



const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});


router.post("/createdocument", authenticate, upload.single("document_name"), createDocument)
router.put("/updatedocumnet", upload.single("document_name"),)

export default router;