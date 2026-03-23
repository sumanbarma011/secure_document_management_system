import mongoose  from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const mongodb_url=process.env.MONGODB_URI || " "
const connection = async ()=>{
    mongoose.connect(mongodb_url).then(()=>{
        console.log("Database is connected successfully");
        
    }).catch((error)=>{
        console.log("Database cannot be connected ", error);
        
    })
}
export default connection