// const mongoose = require('mongoose');
// const mongoURI ="mongodb+srv://chdarshan99:merchant@cluster0.i7o9b.mongodb.net/";
// const connectToMongo = ()=>{
//     mongoose.connect(mongoURI,{
    
//     },).then(()=>console.log("connected successfully"))
//     .catch((err)=>{console.log(err)})
// };
//  module.exports= connectToMongo;



 import mongoose from "mongoose";
 import dotenv from "dotenv";  
dotenv.config();

// Function to connect to the database
const connectDB = async () => {
  // Check if already connected to avoid creating multiple connections
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect("mongodb+srv://chdarshan99:merchant@cluster0.i7o9b.mongodb.net/", {
      dbName: "Valuekarts",
      maxPoolSize:10
    }); 
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

export default connectDB;
