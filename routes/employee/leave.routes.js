import express from "express"
import leaveController from "../../controllers/employee/leave.controller.js"
const router=express.Router()

router.post("/",leaveController.createLeave)
      .get("/",leaveController.getAllLeaves)
      .get("/:id",leaveController.getLeaveById)

export default router;