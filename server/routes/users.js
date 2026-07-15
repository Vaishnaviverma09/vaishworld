const express = require("express");
const User = require("../models/User");
const router = express.Router();

// ✅ SPECIFIC ROUTE FIRST (NO dynamic params)
router.post("/create", async (req, res) => {
  console.log("📝 Creating new user...");
  try {
    const user = new User();
    await user.save();
    console.log("✅ User created:", user._id);
    res.json({ 
      success: true,
      userId: user._id,
      user: { _id: user._id, createdAt: user.startedAt }
    });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ DYNAMIC ROUTE LAST (with :params)
router.get("/:userId", async (req, res) => {
  try {
    console.log("🔍 Finding user:", req.params.userId);
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("❌ Error finding user:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;# force update
