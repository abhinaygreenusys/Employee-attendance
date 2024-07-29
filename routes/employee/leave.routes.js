import express from "express"
import leaveController from "../../controllers/employee/leave.controller.js"
const router=express.Router();

router.post("/createLeave",leaveController.createLeave)
      .get("/getAllLeaves",leaveController.getAllLeaves)
      .get("/getLeaveById/:id",leaveController.getLeaveById)

export default router;