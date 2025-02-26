import connectDB from "./db.js";
import express from "express";
import authRoutes from "./routes/auth.js";
import products from "./routes/products.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import uploadRoutes from './routes/uploadRoutes.js'

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
//avaiable routes
// app.use('/api/auth',require('./routes/auth'))
// app.use('/api/notes',require('./routes/notes'))

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