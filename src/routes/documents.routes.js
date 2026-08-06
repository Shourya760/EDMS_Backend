import express from "express";
import multer from "multer";
import { deleteDocument, } from "../controllers/documents.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";



const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});



router.delete("/deletedocument", authenticate, deleteDocument)

export default router;