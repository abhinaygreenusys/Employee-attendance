import express from "express";
import multer from "multer";
import employeeController from "../../controllers/employee/profile.controller.js";
const upload = multer();

const router = express.Router();
router
  .post("/createProfile", upload.any(),employeeController.createProfile)
  .get("/getProfile", employeeController.getProfile)
  .patch("/updateProfile", upload.any(), employeeController.updateProfile);

export default router;
