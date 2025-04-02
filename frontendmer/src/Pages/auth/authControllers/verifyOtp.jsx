import axios from 'axios';
import toast from 'react-hot-toast';
import { url } from '../../../Components/backend_link/data';

const verifyOtp = async(phone,otp,orderId) => {

  try {
    const res = await axios.post(`${url}/api/v2/auth/verify`, {
      phone: "+91" + phone,
      otp,
      orderId
    })

    return res.data;
  } catch (error) {
    toast.error('An error occurred while verifying OTP');
  }
}

export default verifyOtp