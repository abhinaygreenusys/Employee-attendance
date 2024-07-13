import express from "express"
import { auth } from "../../middlewares/employee.auth.js";
import attendanceController from "../../controllers/employee/attendance.controller.js"
const router=express.Router();

router.post("/",attendanceController.createAttendance)
      .get("/",attendanceController.getAllAttendance)
      .get("/:id",attendanceController.getAttendanceById)
      .patch("/:id",attendanceController.updateAttendance)

      export default router