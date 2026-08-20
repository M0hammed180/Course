const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      unique: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Score = mongoose.model("score", scoreSchema);

module.exports = Score;
