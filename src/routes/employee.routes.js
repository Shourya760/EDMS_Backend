import express from "express";
import multer from "multer";
import { authenticate } from "../middleware/authMiddleware.js";
import { createEmployee, deleteEmployee, getAllEmployee, getOneEmployee, updateEmployee } from "../controllers/employee.controller.js";



const upload = multer({
  storage: multer.memoryStorage(),
});


const router = express.Router()

router.post("/employee", authenticate,
  upload.fields([
    {
      name: "profile_image",
      maxCount: 1
    },
    {
      name: "documents",
      maxCount: 20
    },
    {
      name: "documentTypes",
      maxCount: 20
    }
  ]), createEmployee)
router.get("/getemployee", authenticate, getAllEmployee)
router.get("/getoneemployee", authenticate, getOneEmployee)
router.delete("/deleteemployee", authenticate, deleteEmployee)
router.patch("/updateemployee",updateEmployee)


export default router;