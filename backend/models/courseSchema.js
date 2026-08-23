const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
      trim: true, 
    },
    levels: {
      type: Number, 
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    teacherId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',                      
    required: true                      
  },
    photo: {
      type: String, 
      required: false,
    },

  },
  {
    timestamps: true, 
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;