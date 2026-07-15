const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const User = require("../models/User");

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const ext = path.extname(file.originalname) || ".png";
    cb(null, `auth-${Date.now()}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image uploads are accepted."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ============================================
// SPECIFIC ROUTES FIRST
// ============================================

// POST - Upload image and create user
router.post("/", (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No image was received." });
    }

    try {
      console.log("📝 Uploading image:", req.file.filename);
      
      // Create user with image info
      const user = new User({
        image: {
          filename: req.file.filename,
          url: `/uploads/${req.file.filename}`,
          uploadedAt: new Date()
        }
      });
      await user.save();
      
      console.log("✅ User created with image:", user._id);
      
      return res.json({
        success: true,
        message: "Authentication image received.",
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        userId: user._id
      });
    } catch (error) {
      console.error("❌ Error creating user:", error);
      return res.status(500).json({ error: "Failed to create user record" });
    }
  });
});

module.exports = router;