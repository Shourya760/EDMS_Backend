import express from "express";
import multer from "multer";
import { authenticate } from "../middleware/authMiddleware.js";

import {
  registerUser,
  getAllUsers,
  deleteUserByEmail,
  loginUser,
  getUser,
  getUserById,
  getCurrentUserProfile,
  UpdateUser
} from "../controllers/auth.controller.js";


const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

// Unprotected Routes
router.post("/register", upload.single("profile_image"), registerUser);
router.post("/login", loginUser)

// Protected Routes
router.get("/info", authenticate, getAllUsers)
router.delete("/deletebyemail", authenticate, deleteUserByEmail)
router.get("/getUserById", authenticate, getUserById)
router.get("/getuser", authenticate, getUser)
router.get("/profile", authenticate, getCurrentUserProfile)

router.patch("/updateUser", upload.single("profile_image"), UpdateUser)




export default router;