const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {

    timeLimit: {
      type: Number,
      required: true,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
          trim: true,
        },

        options: [
          {
            type: String,
            required: true,
          },
        ],

        correctAnswer: {
          type: Number,
          required: true,
        },

        points: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
