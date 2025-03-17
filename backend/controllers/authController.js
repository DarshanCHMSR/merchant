import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/authEncryption.js";
import axios from "axios";

// * register handler
const JWT_SECRET = "asdfghjkl12345678";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, emailPassword,role,gst,shop,Latitude,Longitude,address } = req.body;

    // if ((!phone || !email) && !name) {
    //   return res.send({ message: "All fields are required" });
    // }

    // * Check if the use already exists or not
    if (email) {
      const existingUser = await userModel.findOne({ email });

      if (existingUser) {
        return res.status(300).send({
          success: false,
          message: "This email already exists",
        });
      }
    } else if (phone) {
      const existingPhone = await userModel.findOne({ phone });

      if (existingPhone) {
        return res.status(300).send({
          success: false,
          message: "This phone number already exists",
        });
      }
    }

    const user = new userModel({
      name,
      email,
      phone,
      role,
      gst,
      shop,
      address,
    Latitude,
    Longitude,
    });
    // * Registering the user
// console.log("user ",user.Latitude)
    if (!password) {
      const hashedEmailPass = await hashPassword(emailPassword);
      user.emailPassword = hashedEmailPass;
    }
    if (!emailPassword) {
      const hashedPass = await hashPassword(password);
      user.password = hashedPass;
    }

    // * saving the user

    await user.save();

    // * creating token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).send({
      success: true,
      message: "Registered Successfully",
      _id: user._id,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        location: user.location,
        cart: user.cart,
        gst: user.gst,
        shop: user.shop,
        Latitude: user.Latitude,
        Longitude: user.Longitude,
        address: user.address,
      },

      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Registration failed due internal server error",
      msg:error.message
    });
  }
};

// * Login Handler
export const loginController = async (req, res) => {
  try {
    const { email, phone, password, emailPassword } = req.body;

    let user;

    if (email) {
      user = await userModel.findOne({ email }).lean();
    } else if (phone) {
      user = await userModel.findOne({ phone }).lean();
    }
    if (!user) {
      return res.status(400).send({ message: "User does not exist" });
    }

    if (emailPassword !== undefined) {
      const match = await comparePassword(emailPassword, user.emailPassword);
      if (!match) {
        return res.status(400).send({ message: "Wrong Password" });
      }
    } else {
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(400).send({ message: "Wrong Password" });
      }
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: "KA India",
        altPhone: user.altPhone,
        location: user.location,
        cart: user.cart,
      },   
      token,
    }); 
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
      error,
    });
  }
};
// * Forgot password controller
export const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find the user by email or phone
    let user;
    if (email) {
      user = await userModel.findOne({ email });
    } 
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Hash the new password before saving
    const hashedPassword = await hashPassword(newPassword);

    // Update the password in the database
    if (email) {
      user.emailPassword = hashedPassword;
    } 

    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// * OTP sender
export const otpController = async (req, res) => {
  const { phone } = req.body;

  const clientId = "7ZTENLFHEYX58X5EKJSPS1B7CKQ0VFJ7";
  const clientSecret = "rs4k4hgx7azgq8cnh9hvhlibtt5f2xa7";

  let data = JSON.stringify({
    phoneNumber: "91" + phone,
    otpLength: 6,
    channel: "SMS",
    expiry: 60,
  });
// console.log("data",data)
  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: "https://auth.otpless.app/auth/otp/v1/send",
    headers: {
      clientId: clientId,
      clientSecret: clientSecret,
      "Content-Type": "application/json",
    },
    data: data,
  };
// console.log("config",config)
  try {
    const response = await axios.request(config);
    const orderId = response.data.orderId;
    res.status(200).json({ orderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// * OTP verification
export const otpVerification = async (req, res) => {
  try {
    const { phone, otp, orderId } = req.body;

    const clientId = "7ZTENLFHEYX58X5EKJSPS1B7CKQ0VFJ7";
    const clientSecret = "rs4k4hgx7azgq8cnh9hvhlibtt5f2xa7";

    let data = JSON.stringify({
      orderId: orderId,
      otp: otp,
      phoneNumber: phone,
    });

    const config = {
      method: "POST",
      maxBodyLength: Infinity, // Corrected property name
      url: "https://auth.otpless.app/auth/otp/v1/verify",
      headers: {
        clientId: clientId,
        clientSecret: clientSecret,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);
    // console.log("response",response.data)
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// * resend Otp controller
export const resendOtpcontroller = async (req, res) => {
  const { orderId } = req.body;

  const clientId = "7ZTENLFHEYX58X5EKJSPS1B7CKQ0VFJ7";
  const clientSecret = "rs4k4hgx7azgq8cnh9hvhlibtt5f2xa7";

  let data = JSON.stringify({
    orderId: orderId,
  });

  const config = {
    method: "POST",
    maxBodyLength: Infinity, // Corrected property name
    url: "https://auth.otpless.app/auth/otp/v1/resend",
    headers: {
      clientId: clientId,
      clientSecret: clientSecret,
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    const orderId = response.data.orderId; // Extracting the orderId from the response
    res.status(200).json({ orderId });
  } catch (error) {
    res.status(500).send("Error while resending the otp");
  }
};

// * Getting single user
export const getUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id).lean();

    res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).send({
      message: "internal server error",
    });
  }
};

// * This function will update the user data
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, emailPassword, phone, address, altPhone , cordinates } =
      req.body;

      
    const user = await userModel.findById(req.user._id).lean();

    if (name) {
      user.name = name;
    }
    if (email) {
      let existingUser = await userModel.findOne({ email }).lean();

      if (
        existingUser &&
        existingUser._id.toString() !== req.user._id.toString()
      ) {
        return res.status(400).send({
          success: false,
          message: "This email is already registered",
        });
      } else {
        user.email = email;
      }
    }

    if (emailPassword) {
      const hashedEmailPass = await hashPassword(emailPassword);
      user.emailPassword = hashedEmailPass;
    }
    if (address) {
      user.address = address;
    }
    if (phone) {
      const existingUser = await userModel.findOne({ phone }).lean();
      if (
        existingUser &&
        existingUser._id.toString() !== req.user._id.toString()
      ) {
        return res.status(400).send({
          success: false,
          message: "This phone number is already registered",
        });
      } else {
        user.phone = phone;
      }
    }


    if(cordinates){
      user.location.latitude = cordinates.latitude;
      user.location.longitude = cordinates.longitude;
    }

    if (altPhone) {
      user.altPhone = altPhone;
    }

    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "internal server error",
    });
  }
};

// * This function will get all the users for admin purpose
export const getUsersListController = async (req, res) => {
  try {
    const users = await userModel.find().lean();

    res.status(200).send({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "internal server error",
    });
  }
};
// this is the fucntion is used the get the k users
export const getkUsers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
  
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(Math.max(1, Number(limit)), 100);
  
  
    try {
      const users = await userModel
        .find()
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .sort({ createdAt: -1 })
        .lean();
  
      const totalUsers = await userModel.countDocuments();
  
      res.json({
        users,
        totalUsers,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalUsers / limitNumber),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const deleteUser = async (req, res) => {
    try {
      const users = await userModel
        .findByIdAndDelete(req.params.id)
  
      res.status(201).send({
        success: true,
        message: "User deleted successfully",
        users,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  };


// * the route should return the rated user details but it is not working as expected.(future update)
export const getRateUserListController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id).lean();

    res.status(200).send({
      success: true,
      name: user.name,
      user,
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
