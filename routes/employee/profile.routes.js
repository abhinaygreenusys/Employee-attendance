import express from "express"
import multer from "multer";
import employeeController from "../../controllers/employee/profile.controller.js";
const upload =multer(); 

const router=express.Router();

router.get("/",employeeController.getProfile)
router.patch("/",upload.any(),employeeController.updateProfile)

export default router;