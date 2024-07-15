 import express from "express"
 import accountRoutes from "./employee/account.routes.js"
 import profileRoutes from "./employee/profile.routes.js"
 import attendanceRoutes from "./employee/attendance.routes.js"
 import leaveRoutes from "./employee/leave.routes.js"
import { auth } from "../middlewares/employee.auth.js";
 const router=express.Router();

 router.use("/",accountRoutes)
 router.use("/profile",auth,profileRoutes)
router.use("/attendance",auth,attendanceRoutes)
router.use("/leave",auth,leaveRoutes)
export default router;