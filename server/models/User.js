const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Store image as Base64 (you can view it in Compass)
  image: {
    data: String,    // Base64 encoded image
    contentType: String,  // e.g., "image/png", "image/jpeg"
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  // Quiz answers
  quizAnswers: [{
    questionIndex: Number,
    question: String,
    selectedOption: String,
    isCorrect: Boolean,
    correctAnswer: String,
    answeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  quizScore: {
    type: Number,
    default: 0
  },
  quizCompleted: {
    type: Boolean,
    default: false
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

module.exports = mongoose.model('User', userSchema);