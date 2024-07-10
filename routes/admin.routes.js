import express from "express";
import accountRoutes from "./admin/account.routes.js"
import profileRoutes from "./admin/profile.routes.js"
import attendanceRoutes from "./admin/attendance.routes.js"
import { auth } from "../middlewares/admin.auth.js";
const router=express.Router();

router.use("/",accountRoutes)
router.use("/",profileRoutes)
router.use("/attendance",auth,attendanceRoutes)


export default router