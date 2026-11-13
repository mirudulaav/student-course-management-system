require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Import your routes
const connectDB = require("./config/db");
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const learningProgressRoutes = require("./routes/learningProgressRoutes");

const errorHandler = require("./middleware/errorMiddleware");

const PORT = process.env.PORT || 5000;
const app = express();

// Behind Vercel's proxy: use the real client IP for rate limiting
app.set("trust proxy", 1);

// Middleware
const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(morgan("combined"));
app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman/curl (no origin) and trusted frontends
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(
        Object.assign(
          new Error("Origin not allowed by CORS"),
          { status: 403 }
        )
      );
    }
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test and Health Check Routes
app.get("/", (req, res) => {
    res.json({ message: "Student Course Management API is running" });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is healthy",
        timestamp: new Date().toISOString()
    });
});

// API Routes (Mounted under /api/v1 to prevent 404 errors)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/progress", learningProgressRoutes);

app.use((req, res) =>
  res.status(404).json({ message: "API endpoint not found" })
);
app.use(errorHandler);

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
}

startServer();