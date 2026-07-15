const express = require("express");
const User = require("../models/User");
const router = express.Router();

// ============================================
// SPECIFIC ROUTES FIRST (no dynamic params)
// ============================================

// POST - Create new user
router.post("/create", async (req, res) => {
  console.log("📝 Creating new user...");
  
  try {
    const user = new User();
    await user.save();
    
    console.log("✅ User created:", user._id);
    
    res.json({ 
      success: true,
      userId: user._id,
      user: {
        _id: user._id,
        createdAt: user.startedAt
      }
    });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// DYNAMIC ROUTES LAST (with :params)
// ============================================

// GET - Get user by ID
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

// GET - Get user with quiz answers only
router.get("/:userId/quiz", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('quizAnswers quizScore quizCompleted');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      quizAnswers: user.quizAnswers,
      quizScore: user.quizScore,
      quizCompleted: user.quizCompleted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update user (general)
router.put("/:userId", async (req, res) => {
  try {
    const updateData = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;