const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  // Include quiz data with feedback
  quizScore: {
    type: Number,
    default: null
  },
  quizAnswers: [{
    question: String,
    selectedOption: String,
    isCorrect: Boolean
  }],
  receivedAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);