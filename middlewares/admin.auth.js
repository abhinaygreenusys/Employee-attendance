import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Admin } from "../models/admin.model.js";

export const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res.status(401).json({ error: "Unauthorized" });
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      console.log("Middle=",decode);
      const userId = decode?._id;
      if (!mongoose.Types.ObjectId.isValid(userId))
        return res.status(404).json({ error: "No user with that id" });
      
        const user=await Admin.findById(userId);
        if(!user) return res.status(401).json({error:"User not found"});
        
          req.userId=userId
          next();

    } catch (error) {
      res.status(401).json({ error: "Token expired,please log in again"});
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};
