const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
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

  courseComplete: Boolean,

  courseLevels: Number,

  completedLevels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
    },
  ],
});

const Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;
