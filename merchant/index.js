import connectDB from "./db.js";
import express from "express";
import authRoutes from "./routes/auth.js";
import  serverless from "serverless-http";
import bodyParser from 'body-parser';
import dotenv from "dotenv";  
import cors from "cors";
connectDB();

const app = express()
// const port = 5000
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
app.get('/health', (req, res) => {
  res.send('Hello, your backend is running!');
});


app.use("/api/v2/auth", authRoutes);


// app.listen(port, () => {
//   console.log(`merchant backend listening on port http://localhost:  ${port}`)
// })
export const handler = serverless(app);








