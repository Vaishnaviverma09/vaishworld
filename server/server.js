const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();

const uploadRouter = require("./routes/upload");
const qrRouter = require("./routes/qr");
const feedbackRouter = require("./routes/feedback");
const userRouter = require("./routes/users");
const quizRouter = require("./routes/quiz");

const app = express();
const PORT = process.env.PORT || 5000;

// ---- MongoDB Connection ----
// REMOVED the deprecated options
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Make sure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded images
app.use("/uploads", express.static(uploadsDir));

// ---- Routes ----
app.use("/api/upload", uploadRouter);
app.use("/api/qr", qrRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/users", userRouter);
app.use("/api/quiz", quizRouter);

// Health check
app.get("/api/health", async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({ 
    status: "ok", 
    mongodb: dbStatus 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});