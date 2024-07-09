import { Employee } from "../../models/employee.model.js";
import { sentMessage } from "../../utils/sentMessage.utils.js";
import jwt from "jsonwebtoken";

const routes = {};

routes.register = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "All field Required" });
    const emp = await Employee.findOne({ phone });
    if (!emp?.isVerified) {
      await Employee.deleteOne(emp);
    } else {
      return res.status(400).json({ error: "Employee already exists" });
    }
    // if (emp) return res.status(400).json({ error: "Employee already exists" });

    // genrate otp and expire time
    const otp = Math.floor(100000 + Math.random() * 999999);
    const expiresIn = new Date().getTime() + 10 * 60 * 1000;
    
    // sent otp message
    sentMessage("9335133803", otp);

    const newEmp = await Employee.create({ phone });
    newEmp.verificationCode = otp;
    newEmp.codeExpire = expiresIn;
    await newEmp.save();

    res
      .status(201)
      .json({ result: newEmp, message: "Employee register successfully" });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.verifyAccount = async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone) return res.status(400).json({ error: "All field Required" });
    const emp = await Employee.findOne({ phone });
    if (!emp) return res.status(400).json({ error: "Employee not found" });
    if (emp.codeExpire < new Date())
      return res.status(400).json({ error: "Code has been Expired" });
    if (emp.verificationCode != code)
      return res.status(400).json({ error: "Invalid Code" });
    emp.isVerified = true;
    await emp.save();
    const accessToken = emp.generateAccessToken();
    const refreshToken = emp.generateRefreshToken();
    res.status(200).json({
      result: { accessToken, refreshToken },
      message: "Account verified successfully",
    });
  } catch (error) {
    console.log("error=", error.message);
    res.status().json({ error: "Something went wrong" });
  }
};

routes.login = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "All field Required" });
    const emp = await Employee.findOne({ phone });
    if (!emp) return res.status(400).json({ error: "Employee not found" });
    if (!emp.isVerified)
      return res.status(400).json({ error: "Account not verified" });
    // const accessToken = emp.generateAccessToken();
    const otp=Math.floor(100000+Math.random()*999999)
    const expiresIn = new Date().getTime()+10*60*1000
    emp.verificationCode = otp;
    emp.codeExpire = expiresIn;
    await emp.save();
    sentMessage("9335133803", otp);
    res.status(200).json({message:"sent otp successfully"})
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went worng" });
  }
};

routes.refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res
        .status(400)
        .json({ error: "Access denied,Refresh Token is missing" });
    const decode = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    const accessToken = jwt.sign(
      { _id: decode },
      _id,
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json({ message: "success", result: accessToken });
  } catch (error) {
    console.log("error=", error.message);
    res.status(422).json({ error: "Invalid Token" });
  }
};

export default routes;
