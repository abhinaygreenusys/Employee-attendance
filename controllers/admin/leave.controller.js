import leaveModel from "../../models/leave.model.js";

const routes = {};

routes.getAllLeaveByEmployee = async (req, res) => {
  try {
    const empId = req.params.id;
    const { limit = 10, page = 1 } = req.query;
    if (!empId)
      return res.status(400).json({ error: "employee id is required" });
    const AllLeaves = await leaveModel
      .find({ empId })
      .skip(limit * (page - 1))
      .limit(limit);
    if (!AllLeaves.length)
      return res
        .status(404)
        .json({ error: "Leaves not found with that employee id" });
    return res
      .status(200)
      .json({ result: AllLeaves, message: "Leaves fetched succesfully" });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateLeaveByEmployee = async (req, res) => {
  try {
    const empId = req.params.id;
    const { leaveId, leaveStatus } = req.body;
    if (!empId)
      return res.status(400).json({ error: "employee id required" });
    if (!leaveId || !leaveStatus)
      return res.status(400).json({ error: "All field required" });
    const leave = await leaveModel.findOneAndUpdate(
      { _id: leaveId, empId },
      { leaveStatus },{new:true}
    );
    if (!leave)
      return res
        .status(404)
        .json({ error: "Leave not found with that employee Id" });
    return res
      .status(200)
      .json({ result: leave, message: "Leave updated succesfully" });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
