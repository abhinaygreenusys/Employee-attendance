import mongoose from "mongoose";
import { Attendance } from "../../models/attendance.model.js";

const routes = {};
routes.getAttendanceHistoryByEmplyee = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const skipValue = limit * (page - 1);
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
                  then: { $concat: [{ $toString: "$hours" }, " hour"] },
                },
                {
                  case: { $gt: ["$minute", 1] },
                  then: { $concat: [{ $toString: "$minute" }, " minute"] },
                },
              ],
              default: {$concat:[{$toString:"$second"}," second"]},
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

    // const temp = attendance?.map((a, i) => {
    //     const In=new Date(a.attendance?.punchIn?.time)
    //     const Out=new Date(a.attendance?.punchOut?.time)
    //     const diff = Math.abs(Out-In);
    //    const hours=diff/1000/60/60
    //    if(hours>1)
    //     return hours

    //    const minute=diff/1000/60
    //    if(minute>1)
    //     return minute;

    //    const second=diff/1000
    //      return second

    // });

    // console.log("temp"=temp);

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

export default routes;
