import mongoose from "mongoose";
const CONNECTION_URL=process.env.MONGO_DB_URL
export const mongoConnect=async()=>{
    try{
        await mongoose.connect(CONNECTION_URL)
        console.log("DB connect Succesfully");
    }catch(error){
       throw new Error(error);
    }
}

