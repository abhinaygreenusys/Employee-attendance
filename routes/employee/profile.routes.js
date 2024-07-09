import express from "express"
import { auth } from "../../middlewares/employee.auth.js";
import employeeController from "../../controllers/employee/profile.controller.js";
import multer from "multer";
const upload =multer(); 

const router=express.Router();

router.get("/",employeeController.getProfile)
router.put("/",upload.any(),employeeController.updateProfile)

export default router;