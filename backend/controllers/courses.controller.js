const courses = require("../models/courseSchema");
const levels = require("../models/levlSchema");
const payments = require("../models/paymentSchema");
const asyncWrapper = require("../middleware/asyncWrapper");
const Quiz = require("../models/quizSchema");

const addCourse = asyncWrapper(async (req, res) => {
  try {
    const { name, price, description, teacherId } = req.body;

    let pathPhoto = "";
    if (req.file) {
      pathPhoto = req.file.path.replace(/\\/g, "/");
    }

    const newCourse = await courses.create({
      name: name,
      teacherId: teacherId,
      levels: 0,
      price: Number(price) || 0,
      description: description,
      photo: pathPhoto,
    });
    res.status(201).json({
      success: true,
      message: "Course Added Successefully",
      course: newCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const editCourse = asyncWrapper(async (req, res) => {
  const { name, price, description, courseId } = req.body;

  let update = {
    name,
    price,
    description,
  };

  let pathPhoto = "";
  if (req.file) {
    pathPhoto = req.file.path.replace(/\\/g, "/");
    update.photo = pathPhoto;
  }

  const editedCourse = await courses.findByIdAndUpdate(courseId, update);

  res.status(200).json({
    success: true,
    message: "Course Updated successfully",
    editedCourse,
  });
});

const deleteCourse = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const deletedCourse = await courses.findByIdAndDelete(id);

  if (!deletedCourse) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  const courseId = deletedCourse._id;

  const courseLevels = await levels.find({ courseId });

  const quizIds = courseLevels
    .filter((level) => level.quizId)
    .map((level) => level.quizId);

  if (quizIds.length > 0) {
    await Quiz.deleteMany({
      _id: { $in: quizIds },
    });
  }

  await levels.deleteMany({ courseId });

  res.status(200).json({
    success: true,
    message: "Course Deleted successfully",
  });
});

const allCourses = asyncWrapper(async (req, res) => {
  try {
    const allCourses = await courses.find();

    res.status(200).json({
      success: true,
      courses: allCourses,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const courseDetailes = asyncWrapper(async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await courses.findById(courseId);
    const courselevels = await levels.find({ courseId });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      course: course,
      levels: courselevels,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const myCourses = asyncWrapper(async (req, res) => {
  try {
    const teacherId = req.params.id;
    const myCourses = await courses.find({ teacherId });

    if (myCourses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Courses not found" });
    }

    res.status(200).json({
      success: true,
      course: myCourses,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const purchasedCourses = asyncWrapper(async (req, res) => {
  try {
    const { id } = req.params;
    const myPayments = await payments.find({ studentId: id });
    const courseIds = myPayments.map((p) => p.courseId);

    const purchasedCourses = await courses.find({
      _id: { $in: courseIds },
    });
    res.status(200).json({
      success: true,
      myPayments: purchasedCourses,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  addCourse,
  editCourse,
  deleteCourse,
  allCourses,
  courseDetailes,
  myCourses,
  purchasedCourses,
};
