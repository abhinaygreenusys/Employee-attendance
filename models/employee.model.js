import mongoose, { Schema } from "mongoose";
// import { jwt } from "twilio";
import { validate } from "uuid";
import jwt from "jsonwebtoken";

const employeeSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    // unique: true,
  },
  employeeId:{
      type: String,
      // unique:true
  },
  phone: {
    type: Number,
    unique:true,
    required:true,
    validate:{
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  isVerified: {
    type: Boolean,
    default:false
  },
  verificationCode: {
    type: Number,
  },
  codeExpire: {
    type: Date,
  },
  dob:{
    type:Date, 
  },
  doj:{
    type:Date, 
  },
  role:{
     type:String
  },
  profilePicture:{
       type:String
  },
  officeLocation:{
    type:String
  },
  currentLocation: {
    type: {
      longitude: {
        type: String,
        required: true,
      },
      latitude: {
        type: String,
        required: true,
      },
    },
  },
},{
  timestamps: true,
});

employeeSchema.methods.generateAccessToken=function(){
                return jwt.sign(
                  {_id:this._id},
                  process.env.JWT_PRIVATE_KEY,
                  {expiresIn:"1d"}
                )
}

employeeSchema.methods.generateRefreshToken=function(){
      return jwt.sign({
        _id:this._id,
      },
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      {expiresIn:"1y"}
    )
}




export const Employee=mongoose.model("Employee",employeeSchema)
