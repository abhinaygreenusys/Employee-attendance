import { Admin } from "../../models/admin.model.js";
import { Employee } from "../../models/employee.model.js";
import { deleteFile, uploadFile } from "../../utils/s3.utils.js";
import {v4 as uuidv4} from "uuid"
const routes = {};

routes.getProfile = async (req, res) => {
  try {
    const user = await Admin.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not Found" });
    res.status(200).json({ result: user, message: "success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went Wrong" });
  }
};

routes.updateProfile = async (req, res) => {
  try {
    const id = req.userId;

    const user = await Admin.findByIdAndUpdate(id, req.body, { new: true });

    if(req.files?.length){
       const file = req.files[0];
       const deletePicture=await deleteFile(user.profilePicture);
       console.log("deletePicture=",deletePicture);
       const data = await uploadFile(
        file,
        `profilePicture/${uuidv4()}-${file?.originalname}`
      );
       const url=data?.Key
       user.profilePicture=url;
       await user.save();
    }
      
    if (!user) return res.status(404).json({ message: "User not Found" });
    res
      .status(200)
      .json({ result: user, message: "Admin Updated Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
routes.dashBoard=async(req,res)=>{
    try{
      const {limit=10,page=1}=req.query

      const user=await Employee.find().skip(limit*(page-1)).limit(limit);
      const totalUser=await Employee.countDocuments();
      if(!user) res.status(404).json({error:"Have no user"})
      res.status(200).json({result:{user,totalUser},message:"success"})
    }catch(error){
      res.status(500).json({ error: "Something went wrong" });   
    }
}
export default routes;
