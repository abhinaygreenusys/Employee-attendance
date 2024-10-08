import { Employee } from "../../models/employee.model.js";
import { deleteFile, uploadFile } from "../../utils/s3.utils.js";
import { v4 as uuidv4 } from "uuid";
const routes = {};

routes.createProfile = async (req, res) => {
  try {
    const { name,role, email, employeeId, dob, doj, officeLocation } = req.body;
    const id = req.userId;

    if (!name||!role || !email || !employeeId || !dob || !doj || !officeLocation) {
      return res.status(400).json({ error: "All feild is required" });
    }

    if (email) {
      const user = await Employee.findOne({ email });
      if (user) return res.status(400).json({ error: "Email already exists" });
    }
    if (employeeId) {
      const user = await Employee.findOne({ employeeId });
      if (user)
        return res.status(400).json({ error: "EmployeeId already exists" });
    }

    req.body.dob = new Date(req.body.dob);
    req.body.doj = new Date(req.body.doj);

    const user = await Employee.findByIdAndUpdate(
      id,
      { name,role, email, employeeId, dob, doj, officeLocation },
      { new: true }
    );

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

    if (!user) return res.status(404).json({ error: "Employee not found" });
    let url;
    if (req.files?.length) {
      if (user.profilePicture) {
        await deleteFile(user.profilePicture);
      }

      const file = req.files[0];
      const data = await uploadFile(
        file,
        `user/profilePicture/${uuidv4()}-${file?.originalname}`
      );
      url = data.Key;
    }

    user.profilePicture = url;
    await user.save();

    res
      .status(201)
      .json({
        result: { employee: user, accessToken, refreshToken },
        message: "User Profile Created Successfully",
      });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getProfile = async (req, res) => {
  try {
    const id = req.userId;
    const user = await Employee.findById(id, {
      phone: 1,
      email: 1,
      employeeId: 1,
      name: 1,
      role: 1,
      profilePicture: 1,
    });
    if (!user) return res.status(404).json({ error: "Employee not found" });
    res.status(200).json({ result: user, message: "success" });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.updateProfile = async (req, res) => {
  try {
    const id = req.userId;
    const { name, role, dob, officeLocation } = req.body;

    if (req.body.dob) req.body.dob = new Date(req.body.dob);

    const user = await Employee.findByIdAndUpdate(
      id,
      { name, role, dob, officeLocation },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "Employee not found" });

    let url;
    if (req.files?.length) {
      if (user.profilePicture) {
        await deleteFile(user.profilePicture);
      }
      const file = req.files[0];
      const data = await uploadFile(
        file,
        `user/profilePicture/${uuidv4()}-${file?.originalname}`
      );
      url = data.Key;
    }

    user.profilePicture = url;
    await user.save();

    res
      .status(200)
      .json({ result: user, message: "User Profile update successfully" });
  } catch (error) {
    console.log("error=", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;

/*

// Given UTC time as a string
const utcTime = '2024-07-08T14:15:50.754Z';

// Create a new Date object from the UTC time
const date = new Date(utcTime);

// Get the offset for IST in minutes (IST is UTC+5:30)
const istOffset = 5.5 * 60;

// Convert the UTC time to milliseconds, add the IST offset, and create a new Date object
const istTime = new Date(date.getTime() + (istOffset * 60 * 1000));

// Format the IST time to a readable string
const options = {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3,
  hour12: false
};

const formattedISTTime = new Intl.DateTimeFormat('en-GB', options).format(istTime);
console.log(`IST time: ${formattedISTTime}`);
*/
