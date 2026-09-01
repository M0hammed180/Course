const { default: mongoose } = require("mongoose");
const asyncWrapper = require("../middleware/asyncWrapper");
const Course = require("../models/courseSchema");
const Level = require("../models/levlSchema");
const Progress = require("../models/progressSchema");
const Comment = require("../models/commentSchema");
const Score = require("../models/scoreSchema");
const payments = require("../models/paymentSchema");
const User = require("../models/userSchema");

const watchLevel = asyncWrapper(async (req, res) => {
  try {
    const { courseId, levelId, userId } = req.body;
    const course = await Course.findById(courseId, "levels");
    const level = await Level.findById(levelId, "level");

    if (!level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      });
    }

    let courseComplete = false;

    if (level.level == course.levels) {
      courseComplete = true;
    }

    const progressBefore = await Progress.findOne(
      { courseId, userId },
      "completedLevels",
    ).populate("completedLevels", "level");

    if (!progressBefore) {
      const progress = await Progress.create({
        courseId,
        courseLevels: course.levels,
        userId,
        completedLevels: [levelId],
      });

      return res.status(200).json({
        success: true,
        message: "Level completed successfully",
        progress,
      });
    }

    const completedLevels = progressBefore.completedLevels;

    const highestLevel = completedLevels.reduce((highest, current) =>
      current.level > highest.level ? current : highest,
    );

    if (level.level <= highestLevel.level) {
      return res.status(200).json({
        success: true,
        message: "Level already completed",
        progress: progressBefore,
      });
    }

    const progress = await Progress.findOneAndUpdate(
      {
        userId,
        courseId,
      },
      {
        $addToSet: { completedLevels: levelId },
        courseComplete,
      },
      {
        returnDocument: "after",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Level completed successfully",
      progress,
      mylevelnow: level.level,
      allLevels: course.levels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const watchedLevel = asyncWrapper(async (req, res) => {
  const { userId, courseId } = req.params;
  const levelsTotal = await Course.findById(courseId, "levels");
  const levelsTotalNum = levelsTotal.levels;
  const progress = await Progress.findOne({
    userId,
    courseId,
  }).populate("completedLevels");

  if (!progress) {
    return res.status(200).json({
      success: true,
      lastLevel: null,
      numberOfLastLevel: 0,
      nextLevel: await Level.findOne({
        courseId,
        level: 1,
      }),
    });
  }

  if (progress.completedLevels.length === 0) {
    return res.status(200).json({
      success: true,
      lastLevel: null,
      numberOfLastLevel: 0,
      nextLevel: await Level.findOne({
        courseId,
        level: 1,
      }),
    });
  }

  const lastLevel = progress.completedLevels.reduce((highest, current) => {
    return current.level > highest.level ? current : highest;
  });

  const numberOfLastLevel = Number(lastLevel.level);
  let numberOfNextLevel = numberOfLastLevel + 1 || 0;
  if (numberOfLastLevel == levelsTotalNum) {
    numberOfNextLevel = numberOfLastLevel;
  }
  const nextLevel = await Level.findOne({
    courseId,
    level: numberOfNextLevel,
  });

  res.status(200).json({
    success: true,
    lastLevel,
    nextLevel,
    numberOfLastLevel,
    levelsTotalNum,
  });
});

const myAchievements = asyncWrapper(async (req, res) => {
  const { userId } = req.params;

  const objectId = new mongoose.Types.ObjectId(userId);

  const result = await Progress.aggregate([
    {
      $match: {
        userId: objectId,
      },
    },
    {
      $unwind: "$completedLevels",
    },
    {
      $group: {
        _id: null,
        completedLevels: {
          $push: "$completedLevels",
        },
      },
    },
  ]);

  const completedCourses = await Progress.countDocuments({
    userId: objectId,
    courseComplete: true,
  });

  const myAllBoughtCourses = await payments.countDocuments({
    studentId: objectId,
  });

  const myComments = await Comment.countDocuments({
    userId: objectId,
  });

  const courseLevels = await Progress.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        totalCourseLevels: {
          $sum: "$courseLevels",
        },
      },
    },
  ]);

  const myallDegreeScore = await Score.aggregate([
    {
      $match: {
        userId: objectId,
      },
    },
    {
      $group: {
        _id: null,
        score: {
          $sum: "$score",
        },
        totalScore: {
          $sum: "$totalScore",
        },
      },
    },
  ]);

  const completedLevels = result[0]?.completedLevels || [];
  const myallDegree = myallDegreeScore[0]?.score || [];
  const myallTotal = myallDegreeScore[0]?.totalScore || [];

  const totalCourseLevels = courseLevels[0]?.totalCourseLevels || 0;

  res.status(200).json({
    completedCourses,
    comments: myComments,
    quizScore: myallDegree,
    totalQuizScore: myallTotal,
    totalCourses: myAllBoughtCourses,
    completedLevels: completedLevels.length,
    totalLevels: totalCourseLevels,
  });
});

const mycompleteCourses = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  const objectId = new mongoose.Types.ObjectId(userId);

  const myCourses = await Progress.find(
    { userId: objectId },
    "courseId -_id completedLevels courseLevels",
  ).populate("courseId", "name -_id");

  const courses = myCourses.map((course) => ({
    completed: course.completedLevels.length,
    total: course.courseLevels,
    name: course.courseId.name,
  }));

  const myScore = await Score.find(
    { userId: objectId },
    "score -_id totalScore courseLevels timeFinished quizId",
  );

  const score = myScore.map((score) => ({
    completed: score.score,
    total: score.totalScore,
    timeFinished: Number(score.timeFinished),
    quizId: score.quizId,
  }));

  res.status(200).json({
    success: true,
    courses,
    score,
  });
});

const studentAchivmentForTeacher = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  const pageQuiz = Number(req.params.pageQuiz) || 1;
  const pageStudent = Number(req.params.pageStudent) || 1;
  const pageCourse = Number(req.params.pageCourse) || 1;
  const limit = 2;

  const objectId = new mongoose.Types.ObjectId(userId);

  const courseIds = await Course.distinct("_id", {
    teacherId: objectId,
  });

  const myComments = await Comment.find({
    courseId: { $in: courseIds },
  });

  // const myAllQuizzesDegree = await Course.find({
  //   courseId: { $in: courseIds },
  // });

  const myAllLevels = await Course.aggregate([
    {
      $match: {
        teacherId: objectId,
      },
    },

    {
      $lookup: {
        from: "levels",
        localField: "_id",
        foreignField: "courseId",
        as: "levelsData",
      },
    },

    {
      $unwind: "$levelsData",
    },

    {
      $match: {
        "levelsData.type": "video",
      },
    },

    {
      $group: {
        _id: null,
        allVideoLevels: {
          $sum: 1,
        },
      },
    },
  ]);

  const myAllQuizzes = await Course.aggregate([
    {
      $match: {
        teacherId: objectId,
      },
    },

    {
      $lookup: {
        from: "levels",
        localField: "_id",
        foreignField: "courseId",
        as: "levelsData",
      },
    },

    {
      $unwind: "$levelsData",
    },

    {
      $match: {
        "levelsData.type": "quiz",
      },
    },

    {
      $group: {
        _id: null,
        allQuizzes: {
          $sum: 1,
        },
        allQuizIds: {
          $push: "$levelsData.quizId",
        },
      },
    },
  ]);

  // const myAllQuizDegrees = await Score.aggregate([
  //   {
  //     $match: {
  //       quizId: { $in: myAllQuizzesIds },
  //     },
  //   },

  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "userId",
  //       foreignField: "_id",
  //       as: "userData",
  //     },
  //   },

  //   {
  //     $unwind: "$userData",
  //   },

  //   {
  //     $group: {
  //       _id: "$userId",
  //       allQuizUserName: {
  //         $push: "$userData.name",
  //       },
  //       allQuizUserScore: { $push: "$score" },
  //       allQuizUserTotalScore: { $push: "$totalScore" },
  //     },
  //   },
  // ]);
  const myAllQuizzesIds = myAllQuizzes[0].allQuizIds;

  const myStudents = await payments.distinct("studentId", {
    courseId: { $in: courseIds },
  });

  const progressData = await Progress.find({
    courseId: { $in: courseIds },
  })
    .populate("userId", "name username avatar")
    .populate("courseId", "name levels")
    .sort({ createdAt: -1 });

  const myAllQuizDegrees = await Score.aggregate([
    {
      $match: {
        quizId: { $in: myAllQuizzesIds },
      },
    },

    {
      $lookup: {
        from: "levels",
        localField: "quizId",
        foreignField: "quizId",
        as: "levelData",
      },
    },

    {
      $unwind: "$levelData",
    },

    {
      $lookup: {
        from: "quizzes",
        localField: "quizId",
        foreignField: "_id",
        as: "quizData",
      },
    },

    {
      $unwind: "$quizData",
    },
    {
      $lookup: {
        from: "courses",
        localField: "levelData.courseId",
        foreignField: "_id",
        as: "courseData",
      },
    },

    {
      $unwind: "$courseData",
    },

    {
      $group: {
        _id: "$quizId",
        title: {
          $first: "$levelData.title",
        },
        courseName: { $first: "$courseData.name" },
        questionsCount: {
          $first: { $size: "$quizData.questions" },
        },
        studentsCount: { $sum: 1 },

        allQuizUserScore: { $sum: "$score" },

        allQuizUserTotalScore: { $sum: "$totalScore" },
      },
    },

    {
      $sort: {
        studentsCount: -1,
      },
    },
  ]);

  const myAllQuizDegreesN = myAllQuizDegrees.slice(
    (pageQuiz - 1) * limit,
    pageQuiz * limit,
  );

  const progress = progressData.map((p) => {
    return {
      id: p.userId._id,
      name: p.userId.name,
      course: p.courseId.name,
      completed: p.completedLevels.length,
      total: p.courseLevels,
    };
  });

  const progressN = progress.slice(
    (pageStudent - 1) * limit,
    pageStudent * limit,
  );

  const myCoursesAchivments = await Progress.aggregate([
    {
      $match: {
        courseId: { $in: courseIds },
      },
    },
    {
      $project: {
        courseId: 1,
        count: { $size: "$completedLevels" },
        courseLevels: 1,
      },
    },
    {
      $group: {
        _id: "$courseId",

        completedLevels: {
          $sum: "$count",
        },

        totalCourseLevels: {
          $sum: "$courseLevels",
        },
        levels: {
          $first: "$courseLevels",
        },
        students: {
          $sum: 1,
        },
      },
    },

    // populate course
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },

    {
      $unwind: "$course",
    },

    {
      $project: {
        _id: 0,
        id: "$_id",
        name: "$course.name",
        completedLevels: 1,
        totalCourseLevels: 1,
        levels: 1,
        students: 1,
      },
    },
    {
      $addFields: {
        progressPercentage: {
          $multiply: [
            {
              $divide: ["$completedLevels", "$totalCourseLevels"],
            },
            100,
          ],
        },
      },
    },
    {
      $sort: {
        progressPercentage: -1,
      },
    },
  ]);

  const myCoursesAchivmentsN = myCoursesAchivments.slice(
    (pageCourse - 1) * limit,
    pageCourse * limit,
  );

  res.status(200).json({
    stats: {
      Courses: courseIds.length,
      Students: myStudents.length,
      Levels: myAllLevels[0]?.allVideoLevels || 0,
      Quizzes: myAllQuizzes[0]?.allQuizzes || 0,
      Comments: myComments.length,
    },

    myCoursesAchivmentsN,
    myAllQuizDegreesN,
    progressN,

    pages: {
      course: Math.ceil(myCoursesAchivments.length / limit),
      quiz: Math.ceil(myAllQuizDegrees.length / limit),
      student: Math.ceil(progress.length / limit),
    },
  });
});

const myStudentInMyCourse = asyncWrapper(async (req, res) => {
  const { courseId } = req.params;
  const objectId = new mongoose.Types.ObjectId(courseId);

  const myAllStudents = await Progress.aggregate([
    {
      $match: {
        courseId: objectId,
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userData",
      },
    },

    {
      $unwind: "$userData",
    },
    {
      $lookup: {
        from: "courses",
        localField: "courseId",
        foreignField: "_id",
        as: "courseData",
      },
    },

    {
      $unwind: "$courseData",
    },

    {
      $group: {
        _id: "$courseId",
        courseName: {
          $first: "$courseData.name",
        },
        numberOfStudents: { $sum: 1 },
        students: {
          $push: {
            id: "$userData._id",
            name: "$userData.name",
            username: "$userData.email",
            avatar: "$userData.avatar",
            completedLevels: { $size: "$completedLevels" },
            courseLevels: "$courseLevels",
          },
        },
      },
    },

    {
      $sort: {
        _id: -1,
      },
    },
  ]);
  res.status(200).json({
    success: true,
    myAllStudents: myAllStudents[0],
  });
});

const myStudentQuizzes = asyncWrapper(async (req, res) => {
  const { quizId } = req.params;
  const objectId = new mongoose.Types.ObjectId(quizId);

  const myAllStudentsQuizzes = await Score.aggregate([
    {
      $match: {
        quizId: objectId,
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userData",
      },
    },

    {
      $unwind: "$userData",
    },
    {
      $lookup: {
        from: "levels",
        localField: "quizId",
        foreignField: "quizId",
        as: "levelData",
      },
    },

    {
      $unwind: "$levelData",
    },
    {
      $lookup: {
        from: "quizzes",
        localField: "quizId",
        foreignField: "_id",
        as: "quizData",
      },
    },

    {
      $unwind: "$quizData",
    },

    {
      $group: {
        _id: "$quizId",
        quizName: {
          $first: "$levelData.title",
        },
        numberOfStudents: { $sum: 1 },
        students: {
          $push: {
            id: "$userData._id",
            name: "$userData.name",
            username: "$userData.username",
            avatar: "$userData.avatar",
            score: "$score",
            totalScore: "$totalScore",
            timeFinished: "$timeFinished",
            timeLimit: "$quizData.timeLimit",
          },
        },
      },
    },

    {
      $sort: {
        _id: -1,
      },
    },
  ]);
  res.status(200).json({
    success: true,
    myAllStudentsQuizzes: myAllStudentsQuizzes,
  });
});

const myStudentComments = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  const objectId = new mongoose.Types.ObjectId(userId);

  const courseIds = await Course.distinct("_id", {
    teacherId: objectId,
  });

  const commentsRow = await Comment.find({ courseId: { $in: courseIds } })
    .populate("userId", "name avatar")
    .populate("courseId", "name");

  const comments = commentsRow.map((c) => ({
    id: c._id,
    userName: c.userId.name,
    avatar: c.userId.avatar,
    text: c.text,
    updated: c.updated,
    createdAt: c.createdAt,
    courseId: c.courseId._id,
    courseName: c.courseId.name,
  }));

  res.status(200).json({
    success: true,
    comments,
  });
});

module.exports = {
  watchLevel,
  watchedLevel,
  myAchievements,
  mycompleteCourses,
  studentAchivmentForTeacher,
  myStudentInMyCourse,
  myStudentQuizzes,
  myStudentComments,
};
