import express from "express";
import leaveController from "../../controllers/admin/leave.controller.js"
const router=express.Router()

router.get("/:id",leaveController.getAllLeaveByEmployee)
      .patch("/:id",leaveController.updateLeaveByEmployee)

export default router;