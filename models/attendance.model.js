import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema(
  {
    empId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    punchIn: {
      type: {
        time: {
          type: Date,
          default:Date.now()
        },
        longitude: {
          type: String,
          required: true,
        },
        latitude: {
          type: String,
          required: true,
        },
        address: {
          type: String,
        },
      },
      required: true,
    },
    punchOut: {
      type: {
        time: {
          type: Date,
          required: true,
        },
        longitude: {
          type: String,
          required: true,
        },
        latitude: {
          type: String,
          required: true,
        },
        address:{
            type:String
        }
      },
    },
    attendanceStatus: { type: String },
    attendanceType: { type: String },  //fullDay halfday
    attendanceType:{
         
    },
    remark: {
      type: String,  //
    },
  },
  {
    timestamps: true,
  }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);
