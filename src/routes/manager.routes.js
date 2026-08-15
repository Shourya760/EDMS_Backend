import express from "express";
import { createManager, getAllManager, removeManager } from "../controllers/manager.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";



const router = express.Router()


router.post("/addmanager", authenticate, createManager);
router.get("/getmanagers", authenticate, getAllManager);
router.delete("/removemanager", authenticate, removeManager);


export default router;
