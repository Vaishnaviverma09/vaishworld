const express = require("express");
const User = require("../models/User");
const router = express.Router();

// POST - Create new user (for when no image is uploaded)
router.post("/create", async (req, res) => {
  try {
    const user = new User();
    await user.save();
    res.json({ 
      success: true,
      userId: user._id,
      user: {
        _id: user._id,
        createdAt: user.startedAt
      }
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET - Get user by ID with all data
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;