const express = require("express");
const User = require("../models/User");
const router = express.Router();

// POST /api/quiz/:userId/answer - Save a single quiz answer
router.post("/:userId/answer", async (req, res) => {
  try {
    const { userId } = req.params;
    const { questionIndex, question, selectedOption, isCorrect, correctAnswer } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add answer to quizAnswers array
    user.quizAnswers.push({
      questionIndex,
      question,
      selectedOption,
      isCorrect,
      correctAnswer
    });

    // Update score
    if (isCorrect) {
      user.quizScore += 1;
    }

    // Check if quiz is complete (all 5 questions answered)
    if (user.quizAnswers.length === 5) {
      user.quizCompleted = true;
      user.completedAt = new Date();
    }

    await user.save();

    res.json({
      success: true,
      score: user.quizScore,
      completed: user.quizCompleted,
      totalAnswers: user.quizAnswers.length
    });
  } catch (err) {
    console.error("Error saving quiz answer:", err);
    res.status(500).json({ error: "Failed to save quiz answer" });
  }
});

// GET /api/quiz/:userId - Get all quiz answers
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      userId: user._id,
      quizAnswers: user.quizAnswers,
      quizScore: user.quizScore,
      quizCompleted: user.quizCompleted
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve quiz data" });
  }
});

module.exports = router;