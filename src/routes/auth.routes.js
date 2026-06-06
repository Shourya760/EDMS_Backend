import express from "express";
import { registerUser,getAllUsers,deleteUserByEmail} from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/register", registerUser);
router.get("/info",getAllUsers)
router.delete("/deletebyemail", deleteUserByEmail)

export default router;