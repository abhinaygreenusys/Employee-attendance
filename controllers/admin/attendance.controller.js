import mongoose from "mongoose";
import { Attendance } from "../../models/attendance.model.js";

const routes = {};
routes.getAttendanceByEmplyee = async (req, res) => {
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
        $project: {
          punchIn: { $toDate: "$punchIn.time" },
          punchOut: { $toDate: "$punchOut.time" },
        },
      },
      {
        $addFields: {
          diff: {
            $abs: {
              $subtract: ["$punchOut", "$punchIn"],
            },
          },
        },
      },
      {
        $addFields: {
          hours: { $divide: ["$diff", 3600000] },
          minute: { $divide: ["$diff", 60000] },
          second: { $divide: ["$diff", 1000] },
        },
      },
      {
        $switch: {
          branches: [
            {case:{$gt:["$hours",1]},then:"$hours"},
            {case:{$gt:["$minute",1]},then:"$minute"},
          ],
          default: "$second",
        },
      },
      {
        $skip: +skipValue,
      },
      {
        $limit: +limit,
      },
    ];

    // const attendance = await Attendance.aggregate(pipeline);
    const attendance=await Attendance.find({employeeId:id})

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
