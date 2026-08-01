import express from "express";
import { createManager, getAllManager } from "../controllers/manager.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";



const router = express.Router()


router.post("/addmanager", authenticate, createManager)
router.get("/getmanagers", authenticate, getAllManager)


export default router;