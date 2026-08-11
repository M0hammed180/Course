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
    type: mongoose.Schema.Types.ObjectId, // نوع البيانات يجب أن يكون ObjectId
    ref: 'User',                      // يجب أن يتطابق مع اسم الموديل الأساسي
    required: true                        // اختياري: حسب احتياجك
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