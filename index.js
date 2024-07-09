import { startServer } from "./connections/express.connection.js";
import { mongoConnect } from "./connections/mongo.connection.js";

mongoConnect().then(()=>startServer()).catch((err)=>console.error("err=",err.message))
