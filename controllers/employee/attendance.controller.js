import { Attendance } from "../../models/attendance.model.js"

const routes={}
routes.createAttendance=async(req,res)=>{
        try{
            const employeeId=req.userId
            const {punchIn}=req.body
            if(!punchIn)
                return res.status(400).json({message:"All fields are required"})
        const {longitude,latitude,address}=punchIn;
        if(!longitude||!latitude || !address)
                return res.status(400).json({message:"All fields are required"})

          const attendance=await Attendance.create({employeeId,punchIn})
                return res.status(201).json({result:attendance,message:"Attendance Creeated Successfully"})
        }catch(error){
            console.log(error.message);
           res.status(500).json({error:"Something went wrong"})
        }
}
routes.getAllAttendance=async(req,res)=>{
         try{
            const employeeId=req.userId
            const attendances=await Attendance.find({employeeId})
            if(!attendances)
                return res.status(404).json({message:"No Attendance Found"})

            return res.status(200).json({result:attendances,message:"Attendance fetched Successfully"})
         }catch(error){
                console.log("error=",error.message)
             res.status(500).json({error:"Something went wrong"})
         }
}

routes.getAttendanceById=async(req,res)=>{
      try{
         const employeeId=req.userId;
         const {id}=req.params;
         const attendance= await Attendance.findOne({_id:id,employeeId})
         if(!attendance) 
                return res.status(404).json({message:"No Attendance Found"})

         return res.status(200).json({result:attendance,message:"Attendance fetched Successfully"})

      }catch(error){
        console.log("error=",error.message)
           res.status(500).json({error:"Something went wrong"})
      }
}

routes.updateAttendance=async(req,res)=>{
        try{
                const employeeId=req.userId;
                const {id}=req.params;
                const {punchOut}=req.body;
                if(!punchOut)
                        return res.status(400).json({message:"All fields are required"})
                const {time,latitude,longitude,address}=punchOut
                if(!time || !latitude ||!longitude || !address)
                        return res.status(400).json({message:"All fields are required"})
                console.log("id=",id);
                const attendance=await Attendance.findOneAndUpdate({_id:id,employeeId},{punchOut},{new:true})
                if(!attendance)
                        return res.status(404).json({message:"No Attendance Found"})

                return res.status(200).json({result:attendance,message:"Attendance Updated Successfully"})


        }catch(error){
                console.log("error=",error.message)
                res.status(500).json({error:"Something went wrong"})
        }  

}

export default routes;