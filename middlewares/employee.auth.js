import jwt from "jsonwebtoken"
import mongoose from "mongoose";

export const auth=(req,res,next)=>{
    try{
        if(!req.headers.authorization)
            res.status(401).json({error:"Unauthorized"});
        const token=req.headers.authorization.split(" ")[1];
        if(!token) return res.status(401).json({error:"Unauthorized"});
        console.log("token=",token);
        try{
            const decode=jwt.verify(token,process.env.JWT_PRIVATE_KEY)
            if(!mongoose.Types.ObjectId.isValid(decode._id))
                       return res.status(401).json({error:"No user with that id"});
            req.userId=decode._id
            next()
            // res.status(200).json({message:decode._id})
        
        }catch(error){
              console.log(error.message);
              res.status(401).json({error:"Token expired,please login again"});
        }
    }catch(error){
        res.status(500).json({error:error.message});
    }
    }