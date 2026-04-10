import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { errorHandler } from "./middleware/errorHandler.js";

// Load .env.local from project root
dotenv.config();
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ found" : "❌ NOT FOUND");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Connect DB then Start ────────────────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "pcsensei",
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log("✅  MongoDB connected → pcsensei");
  } catch (err) {
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

connectDB().then(async () => {
  // Wait for mongoose to be fully ready before importing models
  await mongoose.connection.asPromise();

  const { default: componentRoutes } = await import("./routes/components.js");
  const { default: buildRoutes } = await import("./routes/builds.js");
  const { default: adminRoutes } = await import("./routes/admin.js");
  const { default: authRoutes } = await import("./routes/auth.js");

  app.use("/api/auth", authRoutes);
  app.use("/api/components", componentRoutes);
  app.use("/api/builds", buildRoutes);
  app.use("/api/admin", adminRoutes);

  app.listen(PORT, () => {
    console.log(`🚀  PCSensei API → http://localhost:${PORT}`);
  });
});