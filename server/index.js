import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { errorHandler } from "./middleware/errorHandler.js";

// Load .env.local from project root
dotenv.config();
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ found" : "❌ NOT FOUND");

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const allowedOrigins = [
  'https://pc-sensei.vercel.app',
  'https://www.pcsensei.pr1nce.tech',
  'https://pcsensei.pr1nce.tech',
  'http://localhost:5173',
]

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS blocked: ${origin}`))
      }
    },
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

  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(__dirname, "../dist");
    app.use(express.static(distPath));
    app.get(/.*/, (req, res) => {
      if (req.path.startsWith("/api")) {
        return res.status(404).json({ error: "Not found" });
      }
      return res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // ─── Global Error Handler ───────────────────────────────────────────────────
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`🚀  PCSensei API → http://localhost:${PORT}`);
  });
});