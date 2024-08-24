import { Attendance } from "../../models/attendance.model.js";

const routes = {};
routes.createAttendance = async (req, res) => {
  try {
    const employeeId = req.userId;
    const { punchIn } = req.body;
    if (!punchIn)
      return res.status(400).json({ message: "All fields are required" });
    const { longitude, latitude, address } = punchIn;
    console.log(punchIn);
    if (!longitude || !latitude || !address)
      return res.status(400).json({ message: "All fields are required" });

    punchIn.time = new Date().toISOString();

    const attendance = await Attendance.create({ empId: employeeId, punchIn });
    return res.status(201).json({
      result: attendance,
      message: "Attendance Creeated Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
routes.getAllAttendance = async (req, res) => {
  try {
    const employeeId = req.userId;
    const attendances = await Attendance.find(
      { empId: employeeId },
      { empId: 0 }
    );
    if (!attendances)
      return res.status(404).json({ message: "No Attendance Found" });

    return res.status(200).json({
      result: attendances,
      message: "Attendance fetched Successfully",
    });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAttendanceById = async (req, res) => {
  try {
    const employeeId = req.userId;
    const { id } = req.params;
    const attendance = await Attendance.findOne(
      { _id: id, empId: employeeId },
      { empId: 0 }
    );
    if (!attendance)
      return res.status(404).json({ message: "No Attendance Found" });

    return res
      .status(200)
      .json({ result: attendance, message: "Attendance fetched Successfully" });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateAttendance = async (req, res) => {
  try {
    const employeeId = req.userId;
    const { id } = req.params;
    const { punchOut } = req.body;
    if (!punchOut)
      return res.status(400).json({ message: "All fields are required" });
    const { time, latitude, longitude, address } = punchOut;
    if (!latitude || !longitude || !address)
      return res.status(400).json({ message: "All fields are required" });
    punchOut.time = new Date().toISOString();
    console.log("id=", id);
    const attendance = await Attendance.findOne({ _id: id, empId: employeeId });
    if (!attendance)
      return res.status(404).json({ message: "No Attendance Found" });

    if (attendance.punchOut)
      return res.status(400).json({ message: "Attendance already marked" });
    attendance.punchOut = punchOut;

    const punchInTime = new Date(attendance.punchIn.time);
    const punchOutTime = new Date(punchOut.time);
    console.log((punchOutTime - punchInTime) / 60 / 60 / 1000);

    if (punchOutTime - punchInTime >= 28800000)
      // check condition for 8 hours
      attendance.attendanceType = "Full-Day";
    else attendance.attendanceType = "Half-Day";

    await attendance.save();
    return res
      .status(200)
      .json({ result: attendance, message: "Attendance Updated Successfully" });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.setNewLocation = async (req, res) => {
  try {
    const employeeId = req.userId;
    const { attendanceId } = req.params;
    const { latitude, longitude, address } = req.body;
    if (!latitude || !longitude || !address)
      return res.status(400).json({ error: "All fields are required " });
    const attendance = await Attendance.findOne({
      _id: attendanceId,
      empId: employeeId,
    });
    if (!attendance)
      return res.status(404).json({ error: "Attendance Not Found" });

    if(!attendance.punchIn){
        return res.status(400).json({ error: "Not Valid Attandance" }); 
    }


     if (attendance.intermediateLocations.length) {
    const temp=  attendance.intermediateLocations.find(
        (location) =>
          location.latitude != latitude && location.longitude != longitude
      );
      if(temp!=0)
        return res.status(200).json({ message: "New Location is update" });
    }

    

    if(attendance.punchIn && attendance.punchOut){
      return res.status(400).json({ error: "Attendance is marked" });
    }

    attendance.intermediateLocations.push({ latitude, longitude, address });
    await attendance.save();
    return res.status(200).json({ message: "New Location is update" });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
