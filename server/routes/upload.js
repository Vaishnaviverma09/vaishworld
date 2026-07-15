const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const User = require("../models/User");

const router = express.Router();

// Use memory storage to get file buffer
const storage = multer.memoryStorage();

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
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/", (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No image was received." });
    }

    try {
      // Convert image to Base64
      const base64Image = req.file.buffer.toString('base64');
      
      // Create user with Base64 image
      const user = new User({
        image: {
          data: base64Image,
          contentType: req.file.mimetype,
          filename: req.file.originalname
        }
      });
      await user.save();
      
      return res.json({
        success: true,
        message: "Authentication image received.",
        userId: user._id
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Failed to create user record" });
    }
  });
});

module.exports = router;