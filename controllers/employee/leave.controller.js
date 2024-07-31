import leaveModel from "../../models/leave.model.js";

const routes = {};
routes.createLeave = async (req, res) => {
  try {
    const employeeId = req.userId;
    const { leaveType, startDate, endDate, reason } = req.body;
    console.log(req.body);
    if (!leaveType || !startDate || !endDate || !reason)
      return res.status(400).json({ error: "All field required" });
    new Date(startDate);

    console.log({ employeeId, ...req.body });
    const leave = await leaveModel.create({
      empId: employeeId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      ...req.body,
    });
    res
      .status(201)
      .json({ result: leave, message: "Leave created succesfully" });
  } catch (error) {
    console.log("error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllLeaves = async (req, res) => {
  try {
    const { userId } = req;
    const allLeaves = await leaveModel.find({ employeeId: userId });
    if (!allLeaves) return res.status(404).json({ error: "Leave not found" });
    res
      .status(200)
      .json({ result: allLeaves, message: "All leaves fetched succesfully" });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getLeaveById = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const { userId } = req;
    const leave = await leaveModel.findOne({
      _id: leaveId,
      employeeId: userId,
    });
    if (!leave) return res.status(404).json({ error: "Leave not found" });
    res
      .status(200)
      .json({ result: leave, message: "Leave fetched succesfully" });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
export default routes;
