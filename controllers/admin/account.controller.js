import { Admin } from "../../models/admin.model.js";
import { uploadFile } from "../../utils/s3.utils.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
const routes = {};

routes.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    console.log(req.files[0]);

    if (!name || !email || !password)
      res.status(400).json({ error: "All Field is required!!" });

    if ([name, email, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({ error: "All field is required!!" });
    }
    const ifEmailIsExist = await Admin.findOne({ email });
    if (ifEmailIsExist)
      return res.status(409).json({ error: "User Already Exist" });
    let url = null;
    if (req.files.length) {
      const fileName = req.files[0];

      const data = await uploadFile(
        fileName,
        `admin/profilePicture/${uuidv4()}-${fileName?.originalname}`
      );
      console.log(data);
      url = data.Key;
    }

    const admin = await Admin.create({ ...req["body"], profilePicture: url });

    console.log(admin);
    return res
      .status(201)
      .json({ result: admin, message: "Admin Registerd Successfully !!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Something went wrong" });
  }

  // console.log("admin register=",crypto.randomBytes(32).toString("hex"));
  // console.log("admin register=",crypto.randomBytes(32).toString("hex"));
  //   res.json("admin-register");
};

routes.verifyOtp = async (req, res) => {};

routes.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password)
      return res.status(400).json({ message: " All field Required" });

    const user = await Admin.findOne({ email });

    if (!user) return res.status(404).json({ error: "Invalid credential" });

    const isPasswordValid = await  user.isPasswordCorrect(password);
    if (!isPasswordValid)
      return res.status(404).json({ error: "Invalid credential" });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    res
      .status(200)
      .json({
        msg: "Logged in successfuly",
        result: { accessToken, refreshToken },
      });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error.message);
  }
};

routes.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken)
      return res
        .status(400)
        .json({ error: "Access denied,refresh-token missing!" });

    const decode = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    const id = decode._id;
    const accessToken = jwt.sign({id}, process.env.JWT_PRIVATE_KEY,{
      expiresIn: "1d",
    });
    res.status(201).json({ message: "success", result: accessToken });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: "Something went wrong" });
  }
};
export default routes;
