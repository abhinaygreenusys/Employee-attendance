import express from "express";
import accountController from "../../controllers/admin/account.controller.js"
import multer from "multer";

const router=express.Router();
const upload=multer();
router.post("/register",upload.any(),accountController.register)
      .post("/login",accountController.login)
      .post("/forgot",accountController.forgotPassword)
      .post("/refreshAccessToken",accountController.refreshToken)

export default router;