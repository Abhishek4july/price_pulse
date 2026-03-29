import dotenv from "dotenv";
dotenv.config();

import express, {urlencoded} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
// import pricingRoutes from './routes/pricingRoutes.js';
import productRoutes from './routes/productRoutes.js';

const app = express();


connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());


app.use("/api/auth", authRoutes);
// app.use('/api', pricingRoutes);
app.use('/api', productRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
