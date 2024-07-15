import leaveModel from "../../models/leave.model.js";

const routes = {};

routes.getAllLeaveByEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { limit = 10, page = 1 } = req.query;
    if (!employeeId)
      return res.status(400).json({ error: "employee id is required" });
    const AllLeaves = await leaveModel
      .find({ employeeId })
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

export default routes