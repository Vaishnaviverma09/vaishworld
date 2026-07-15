const express = require("express");
const Feedback = require("../models/Feedback");
const User = require("../models/User");
const router = express.Router();

// ============================================
// SPECIFIC ROUTES FIRST (no dynamic params)
// ============================================

// POST - Submit feedback
router.post("/", async (req, res) => {
  const { message, userId } = req.body;

  console.log("📝 Feedback received from user:", userId);

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Feedback message is required." });
  }

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    // Get user to include quiz data with feedback
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create feedback with quiz data
    const feedback = new Feedback({
      userId: userId,
      message: message.trim(),
      quizScore: user.quizScore,
      quizAnswers: user.quizAnswers.map(answer => ({
        question: answer.question,
        selectedOption: answer.selectedOption,
        isCorrect: answer.isCorrect
      }))
    });

    await feedback.save();

    console.log("✅ Feedback saved for user:", userId);

    res.json({ 
      success: true,
      message: "Feedback saved. Thank you."
    });
  } catch (err) {
    console.error("❌ Error saving feedback:", err);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

// GET - Get all feedback (admin)
router.get("/", async (req, res) => {
  try {
    console.log("📋 Retrieving all feedback...");
    const feedback = await Feedback.find()
      .populate('userId', 'image.url quizScore quizCompleted')
      .sort({ receivedAt: -1 });
    res.json(feedback);
  } catch (err) {
    console.error("❌ Error retrieving feedback:", err);
    res.status(500).json({ error: "Failed to retrieve feedback" });
  }
});

// ============================================
// ROUTES WITH PARAMS (but specific path)
// ============================================

// PUT - Mark feedback as read
router.put("/:id/read", async (req, res) => {
  try {
    console.log("📝 Marking feedback as read:", req.params.id);
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }
    res.json(feedback);
  } catch (err) {
    console.error("❌ Error updating feedback:", err);
    res.status(500).json({ error: "Failed to update feedback" });
  }
});

// ============================================
// DYNAMIC ROUTES LAST (with :params)
// ============================================

// GET - Get feedback for a specific user
router.get("/:userId", async (req, res) => {
  try {
    console.log("📋 Retrieving feedback for user:", req.params.userId);
    const feedback = await Feedback.find({ userId: req.params.userId })
      .sort({ receivedAt: -1 });
    res.json(feedback);
  } catch (err) {
    console.error("❌ Error retrieving feedback:", err);
    res.status(500).json({ error: "Failed to retrieve feedback" });
  }
});

module.exports = router;