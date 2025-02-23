import connectDB from "./db.js";
import express from "express";
import authRoutes from "./routes/auth.js";
import products from "./routes/products.js";
import categoryRoutes from "./routes/categoryRoutes.js";

import cors from "cors";

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

//avaiable routes
// app.use('/api/auth',require('./routes/auth'))
// app.use('/api/notes',require('./routes/notes'))

app.use("/api/v2/product", products);
app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/category", categoryRoutes);

app.listen(port, () => {
  console.log(`inotebook backend listening on port http://localhost:  ${port}`)
})
connectDB();