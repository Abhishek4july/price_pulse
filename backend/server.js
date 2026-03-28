import dotenv from "dotenv";
dotenv.config();

import express, { json, urlencoded, static as expressStatic } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { join } from "path";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();



connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(json({ limit: "10kb" }));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Serve frontend static files ─────────────────────────
// app.use(expressStatic(join(__dirname, "frontend")));

// ─── API Routes ───────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ...
app.use("/api/products", productRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "PricePulse API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
