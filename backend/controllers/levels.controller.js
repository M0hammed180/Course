const levels = require("../models/levlSchema");
const courses = require("../models/courseSchema");

const asyncWrapper = require("../middleware/asyncWrapper");
const Quiz = require("../models/quizSchema");

const Addlevel = asyncWrapper(async (req, res) => {
  const {
    courseId,
    level,
    title,
    description,
    type,
    questions,
    timeLimit,
    video,
  } = req.body;

  const questionsData = questions ? JSON.parse(questions) : [];

  const oldLevel = await levels.findOne({ courseId, level: Number(level) });

  if (oldLevel) {
    await levels.updateMany(
      {
        courseId,
        level: { $gte: Number(level) },
      },
      {
        $inc: { level: 1 },
      },
    );
  }
  let newQuiz = null;

  if (type === "quiz") {
    newQuiz = await Quiz.create({
      questions: questionsData,
      timeLimit: Number(timeLimit),
    });
  }

  const levelData = {
    courseId: courseId,
    level: Number(level),
    title: title,
    video: video || "",
    description: description,
    type: type,
  };

  if (newQuiz) {
    levelData.quizId = newQuiz._id;
  }

  const newLevel = await levels.create(levelData);
  const updateCourse = await courses.findByIdAndUpdate(courseId, {
    $inc: { levels: 1 },
  });
  res.status(201).json({
    success: true,
    message: "Level Added Successefully",
    new: newQuiz || newLevel,
  });
});

const Editlevel = asyncWrapper(async (req, res) => {
  const {
    level,
    title,
    description,
    type,
    questions,
    timeLimit,
    video,
    levelId,
  } = req.body;

  const newLevelNumber = Number(level);

  const oldLevel = await levels.findById(levelId);

  if (!oldLevel) {
    return res.status(404).json({
      success: false,
      message: "Level not found",
    });
  }

  const oldLevelNumber = oldLevel.level;
  const courseId = oldLevel.courseId;
  const quizId = oldLevel.quizId;

  const levelsCount = await levels.countDocuments({ courseId });

  if (newLevelNumber < 1 || newLevelNumber > levelsCount) {
    return res.status(400).json({
      success: false,
      message: `The last level is ${levelsCount}.`,
    });
  }

  if (newLevelNumber < oldLevelNumber) {
    await levels.updateMany(
      {
        courseId,
        level: {
          $gte: newLevelNumber,
          $lt: oldLevelNumber,
        },
      },
      {
        $inc: { level: 1 },
      },
    );
  } else if (newLevelNumber > oldLevelNumber) {
    await levels.updateMany(
      {
        courseId,
        level: {
          $gt: oldLevelNumber,
          $lte: newLevelNumber,
        },
      },
      {
        $inc: { level: -1 },
      },
    );
  }

  let updatedQuiz = null;

  if (type === "quiz") {
    updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      {
        questions: questions ? JSON.parse(questions) : [],
        timeLimit: Number(timeLimit),
      },
      {
        new: true,
      },
    );
  }

  const updatedLevel = await levels.findByIdAndUpdate(
    levelId,
    {
      level: newLevelNumber,
      title,
      video: type === "video" ? video || "" : "",
      description,
      type,
      quizId: type === "quiz" ? quizId : null,
    },
    {
      new: true,
    },
  );

  res.status(200).json({
    success: true,
    message: "Level updated successfully",
    level: updatedLevel,
    quiz: updatedQuiz,
  });
});

const showLevel = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const level = await levels.findById(id).populate("quizId");

  res.status(201).json({
    success: true,
    level,
    type: level.type || "video",
  });
});

const Deletelevel = asyncWrapper(async (req, res) => {
  const { levelId } = req.params;

  const deletedLevel = await levels.findByIdAndDelete(levelId);

  if (!deletedLevel) {
    return res.status(404).json({
      success: false,
      message: "Level not found",
    });
  }

  const level = deletedLevel.level;
  const courseId = deletedLevel.courseId;
  const type = deletedLevel.type || "video";

  await levels.updateMany(
    {
      courseId,
      level: { $gt: Number(level) },
    },
    {
      $inc: { level: -1 },
    },
  );

  if (type == "quiz") {
    const quizId = deletedLevel.quizId;
    await Quiz.findByIdAndDelete(quizId);
  }
  const updateCourse = await courses.findByIdAndUpdate(courseId, {
    $inc: { levels: -1 },
  });

  res.status(200).json({
    success: true,
    message: "Level Deleted successfully",
  });
});

module.exports = { Addlevel, showLevel, Editlevel, Deletelevel };
