import express from "express";
import multer from "multer";
import { deleteDocument, getalldocuments, } from "../controllers/documents.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";



const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});



router.delete("/deletedocument", authenticate, deleteDocument);
router.get("/getalldocument", getalldocuments);

export default router;