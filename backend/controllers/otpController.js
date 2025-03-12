import dotenv from "dotenv";  
import SibApiV3Sdk from 'sib-api-v3-sdk';




const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const otpStore = {};

export const sendotp= async (req, res) => {
  try {  
    const { email} = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    const expiresAt = Date.now() + 5 * 60 * 1000; // Expires in 5 minutes
    otpStore[email] = { otp, expiresAt };

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.templateId = 2;
    sendSmtpEmail.params = { otp };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).send('OTP sent successfully');
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyotp =(req, res) => {
    try {
      const { email, otp } = req.body;
  
      if (!otpStore[email]) {
        return res.status(400).json({ message: 'OTP not found or expired' });
      }
  
      const { otp: storedOtp, expiresAt } = otpStore[email];
  
      if (Date.now() > expiresAt) {
        delete otpStore[email]; // Remove expired OTP
        return res.status(400).json({ message: 'OTP expired' });
      }
  
      if (parseInt(otp) !== storedOtp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      delete otpStore[email]; // Remove OTP after successful verification
      res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ error: error.message });
    }
  };
  