import express from "express"
import profileController from "../../controllers/admin/profile.controller.js"
import { auth } from "../../middlewares/admin.auth.js";
import multer from "multer";

const router=express.Router();
 const upload=multer();
router.get("/profile",auth,profileController.getProfile)
      .put("/profile",auth,upload.any(),profileController.updateProfile)
      .get("/dashboard",auth,profileController.dashBoard)
       
export default router;