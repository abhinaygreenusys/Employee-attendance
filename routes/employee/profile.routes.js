import express from "express";
import multer from "multer";
import employeeController from "../../controllers/employee/profile.controller.js";
const upload = multer();

const router = express.Router();
router
  .post("/", upload.any(),employeeController.createProfile)
  .get("/", employeeController.getProfile)
  .patch("/", upload.any(), employeeController.updateProfile);

export default router;
