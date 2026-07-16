import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";

const app = express();

// ======================
// Middlewares
// ======================
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/v1/auth", authRoutes);

// ======================
// Test Route
// ======================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    project: "AI MetroFlow",
    message: "Backend is running successfully 🚇",
  });
});

export default app;