import leaveModel from "../../models/leave.model.js"

const routes = {};
routes.createLeave = async (req, res) => {
  try {
    const employeeId=req.userId
    const {leaveType, startDate, endDate, reason } = req.body;
    console.log(req.body)
        if(!leaveType || !startDate || !endDate || !reason)
                return res.status(400).json({error:"All field required"})
    console.log({employeeId,...req.body});
    const leave=await leaveModel.create({employeeId,...req.body});
    res.status(201).json({result:leave,message:"Leave created succesfully"})  
  } catch (error) {
    console.log("error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes
