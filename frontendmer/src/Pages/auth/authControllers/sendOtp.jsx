import axios from 'axios';
import { url } from '../../../Components/backend_link/data';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const sendOtp = async (phone) => {
  if (phone.includes('+91')) {
    phone = phone.replace('+91', '')
    ;
  }
  if (phone.startsWith('91') && phone.length > 10) {
    phone = phone.replace('91', '');
  }

  try {
    const res = await axios.post(`${url}/api/v2/auth/send-otp`, {
      phone
    });
    toast.success("OTP sent successfully");
    console.log(res.data.orderId);  
    return res.data.orderId;
  } catch (error) {
    toast.error("Error while sending OTP");
    console.error("Axios Error:", error.response?.data || error.message);    throw error;
  }
}

export default sendOtp;
