import express from "express";
import accountRoutes from "./admin/account.routes.js"
import profileRoutes from "./admin/profile.routes.js"
const router=express.Router();

router.use("/",accountRoutes)
router.use("/",profileRoutes)


export default router