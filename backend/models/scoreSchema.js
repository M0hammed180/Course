const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    timeFinished: {
      type: String,
    },
    incorrectQuestions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        wrongAnswer: Number,
        correctAnswer: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Score = mongoose.model("score", scoreSchema);

module.exports = Score;
