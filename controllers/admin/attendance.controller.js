import mongoose from "mongoose";
import { Attendance } from "../../models/attendance.model.js";

const routes = {};
routes.getAttendanceHistoryByEmplyee = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const skipValue = limit * (page - 1);
         
    if(!id) return res.status(400).json({error:"user id not found"})
      
    console.log(skipValue);
    const pipeline = [
      {
        $match: {
          employeeId: mongoose.Types.ObjectId(id),
        },
      },
      { 
        $addFields: {
          tempPunchIn: { $toDate: "$punchIn.time" },
          tempPunchOut: { $toDate: "$punchOut.time" },
        },
      },
      {
        $addFields: {
          diff: {
            $abs: {
              $subtract: ["$tempPunchOut", "$tempPunchIn"],
            },
          },
        },
      },
      {
        $addFields: {
          hours: { $floor: { $divide: ["$diff", 3600000] } },
          minute: { $floor: { $divide: ["$diff", 60000] } },
          second: { $floor: { $divide: ["$diff", 1000] } },
        },
      },
      {
        $addFields: {
          totalDuration: {
            $switch: {
              branches: [
                {
                  case: { $gt: ["$hours", 1] },
                  then: { $concat: [{ $toString: "$hours" }, " hours"] },
                },
                {
                  case: { $gt: ["$minute", 1] },
                  then: { $concat: [{ $toString: "$minute" }, " minutes"] },
                },
              ],
              default: {$concat:[{$toString:"$second"}," seconds"]},
            },
          },
        },
      },
      {
        $project:{
          tempPunchIn:0,
          tempPunchOut:0,
          diff:0,
          hours:0,
          minute:0,
          second:0,           
        }
      },
      {
        $skip: +skipValue,
      },
      {
        $limit: +limit,
      },
    ];

    const attendance = await Attendance.aggregate(pipeline);

    const totalAttendance = await Attendance.countDocuments({ employeeId: id });

    if (!attendance)
      return res.status(404).json({ error: "No attendance found" });

    console.log(attendance.punchIn?.time);
    console.log(attendance.punchOut?.time);

    res.status(200).json({
      result: { attendance, totalAttendance },
      message: "attendance fetched successfully",
    });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};



routes.getLetestAttendance=async(req,res)=>{
      try{
        const id = req.params.id;
        const attendance=await Attendance.findOne({employeeId:id}).sort({createdAt:-1});
        if(!attendance)
          return res.status(404).json({error:"No attendance found"})

        console.log(attendance)

        res.status(200).json({result:attendance,message:"attendance fetched successfully"})
      }catch(error){
        console.log("error=",error.message);
          res.status(500).json({error:"Something wend wrong"});
      }
}




export default routes;
