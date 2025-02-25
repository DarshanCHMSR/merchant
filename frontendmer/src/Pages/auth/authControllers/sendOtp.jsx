import axios from 'axios'
import { url } from '../../../Components/backend_link/data';

const sendOtp = async (phone) => {
  if(phone.includes('+91')){
    phone = phone.replace('+91','');
  }
  if (phone.startsWith('91') && phone.length > 10) {
    phone = phone.replace('91', '');
  }



  try{
    const res = await axios.post(`${url}/api/v2/auth/send-otp`,{
        phone
    });
    return res.data.orderId;
  }catch(error){
    toast.error("Error while sending otp");
    throw error;
  }
}

export default sendOtp