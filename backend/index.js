import connectDB from "./db.js";
import express from "express";
import authRoutes from "./routes/auth.js";
import products from "./routes/products.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import uploadRoutes from './routes/uploadRoutes.js'
import otpRoutes from "./routes/otpRoutes.js";
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



app.use("/api/v2/otp", otpRoutes);
app.use("/api/v2/products", products);
app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/category", categoryRoutes);

// * this one is getting the presignedURL for uploading images to the s3
app.use('/api/v2/upload',uploadRoutes);

(async () => {
  await connectDB();
})();
app.listen(port, () => {
  console.log(`merchant backend listening on port http://localhost:  ${port}`)
})
