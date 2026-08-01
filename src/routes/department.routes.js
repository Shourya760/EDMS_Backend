import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createDepartment, getalldepartment } from "../controllers/department.controller.js"


const router = express.Router();

router.post("/department", authenticate, createDepartment)
router.get("/getalldepartment", authenticate, getalldepartment)


export default router;




