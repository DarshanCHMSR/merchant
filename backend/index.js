import connectDB from "./db.js";
import express from "express";
import authRoutes from "./routes/auth.js";
import products from "./routes/products.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import uploadRoutes from './routes/uploadRoutes.js'

import SibApiV3Sdk from 'sib-api-v3-sdk';

import AWS from "aws-sdk";
import crypto from "crypto";

import dotenv from "dotenv";  
import cors from "cors";

const app = express()
const port = 5000
app.use(cors({
  origin: '*',
  credentials: true,
  methods: 'GET,POST,PUT,DELETE,OPTIONS'
}))
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello, your backend is running!');
});

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const otpStore = {};
app.post('/send-otp', async (req, res) => {
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
});

app.post('/verify-otp', (req, res) => {
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
});


app.use("/api/v2/products", products);
app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/category", categoryRoutes);

// * this one is getting the presignedURL for uploading images to the s3
app.use('/api/v2/upload',uploadRoutes);

// const s3 = new AWS.S3({
//   accessKeyId: "AKIA6K5V7UA5HJMQ5U5I",
//   secretAccessKey: "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",
//   region: "ap-south-1",
// });

// Generate Pre-Signed URL
// app.get("/s3-presigned-url", async (req, res) => {
//   try {
//       const { filename, mimetype } = req.query;
//       const params = {
//           Bucket: "valuekarts-test-img-data",
//           Key: `uploads/${filename}`,
//           Expires: 60, // URL expires in 60 seconds
//           ContentType: mimetype,
//       };

//       const url = await s3.getSignedUrlPromise("putObject", params);
//       res.json({ url });
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// });

app.listen(port, () => {
  console.log(`merchant backend listening on port http://localhost:  ${port}`)
})
connectDB();