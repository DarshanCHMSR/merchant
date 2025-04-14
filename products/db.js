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
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Valuekarts",
      maxPoolSize:10,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 20000,
    }); 
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

export default connectDB;
