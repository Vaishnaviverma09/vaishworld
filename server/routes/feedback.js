const express = require("express");
const Feedback = require("../models/Feedback");
const User = require("../models/User");

const router = express.Router();

// POST /api/feedback
router.post("/", async (req, res) => {
  const { message, userId } = req.body;

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

    res.json({ 
      success: true,
      message: "Feedback saved. Thank you."
    });
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

// GET /api/feedback - Get all feedback (admin)
router.get("/", async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('userId', 'image.url quizScore quizCompleted')
      .sort({ receivedAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve feedback" });
  }
});

module.exports = router;