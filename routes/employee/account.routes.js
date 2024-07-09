import express from "express";
import accountController from "../../controllers/employee/account.controller.js";
const router=express.Router();

router.post("/register",accountController.register)
      .post("/verifyAccount",accountController.verifyAccount)
      .post("/login",accountController.login)

export default router;
