const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    updated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Score = mongoose.model("comment", commentSchema);

module.exports = Score;
