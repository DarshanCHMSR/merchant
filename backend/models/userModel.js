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

    location: {
      longitude: {
        type: Number,
      },
      latitude: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userModel);
