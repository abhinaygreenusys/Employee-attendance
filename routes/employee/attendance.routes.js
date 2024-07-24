import express from "express"
import { auth } from "../../middlewares/employee.auth.js";
import attendanceController from "../../controllers/employee/attendance.controller.js"
const router=express.Router();

router.post("/createAttendance",attendanceController.createAttendance)
      .get("/getAllAttendance",attendanceController.getAllAttendance)
      .get("/getAttendanceById/:id",attendanceController.getAttendanceById)
      .patch("/updateAttendance/:id",attendanceController.updateAttendance)

      export default router