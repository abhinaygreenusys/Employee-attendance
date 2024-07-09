import express from "express";
import adminRoutes from "../routes/admin.routes.js"
import employeeRoutes from "../routes/employee.routes.js"
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import {config} from "dotenv";

config();
const app = express();
const PORT = process.env.PORT||2020;

app.use(morgan("dev"));
app.use(cors())
app.use(bodyParser.json({limit:"20mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"20mb",extended:true}));

app.use("/admin",adminRoutes)
app.use("/employee",employeeRoutes)

app.get("/", (req, res) => {
  res.send("<h1>Running🤗<h1>");
});

export const startServer = () => {
  try{
    app.listen(PORT, () => {
      console.log(`server Started on http://localhost:${PORT}`);
    });
  }catch(error){
     throw new Error(error)
  }
};
