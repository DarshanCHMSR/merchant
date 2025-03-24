import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
    },
    id:{
      type: String,
      unique:true
    },

    emailPassword:{
      type: String,
    },

    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    altPhone: {
      type: String,
    },
    gst:{
      type: String,
    },
    shop:{
      type: String,
    },

    address: {
      type: String,
    },

    role: {
      type: Number,
    default: 0,
    },
    
    cart: {
      type: [Object], // Changed 'typeof' to 'type' and used Mixed to allow any item structure
      default: [],
    },
    Latitude:{
      type: Number,
    },
    Longitude:{
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userModel);
