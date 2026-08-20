const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    level: {
      type: Number,
      required: false,
    },
    type: {
      type: String,
      enum: ["video", "quiz"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    video: {
      type: String,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: function () {
        return this.type === "quiz";
      },
    },
  },
  {
    timestamps: true,
  },
);

const Level = mongoose.model("level", levelSchema);

module.exports = Level;
