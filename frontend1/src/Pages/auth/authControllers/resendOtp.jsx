import axios from "axios";
import { url } from "../../../Components/backend_link/data";

const resendOtp = async (orderID) => {
  
console.log("Resend : ",orderID);
  try {
    const res = await axios.post(`${url}/api/v2/auth/resend-otp`, {
      orderId: orderID,
    });

    return res.data.orderId;
  } catch (error) {
    console.log("Error while sending otp");
    throw error;
  }
};

export default resendOtp;