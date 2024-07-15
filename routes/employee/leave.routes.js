import express from "express"
import leaveController from "../../controllers/employee/leave.controller.js"
const router=express.Router()

router.post("/",leaveController.createLeave)

export default router;