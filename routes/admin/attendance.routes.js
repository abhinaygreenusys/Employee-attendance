import express from "express";
import attendanceController from "../../controllers/admin/attendance.controller.js"
const router=express.Router();

router.get("/:id",attendanceController.getAttendanceHistoryByEmplyee)
.get("/:id/letest",attendanceController.getLetestAttendance)

export default router;