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
  updateUser,
  updateUserStatus,
  forgotPassword,
  updatePassword
} from "../controllers/auth.controller.js";


const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

// Unprotected Routes
router.post("/register", upload.single("profile_image"), registerUser);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword)
router.patch("/updatePassword", updatePassword)

// Protected Routes
router.get("/getAllUsers", authenticate, getAllUsers)
router.delete("/deletebyemail", authenticate, deleteUserByEmail)
router.get("/getUserById", authenticate, getUserById)
router.get("/getuser", authenticate, getUser)
router.get("/profile", authenticate, getCurrentUserProfile)

router.patch("/updateUser", authenticate, upload.single("profile_image"), updateUser)
router.patch("/users/:userId/status", authenticate, updateUserStatus)



export default router;
