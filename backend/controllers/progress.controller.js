const asyncWrapper = require("../middleware/asyncWrapper");
const Course = require("../models/courseSchema");
const Level = require("../models/levlSchema");
const Progress = require("../models/progressSchema");

const watchLevel = asyncWrapper(async (req, res) => {
  try {
    const { courseId, levelId, userId } = req.body;

    const level = await Level.findById(levelId, "level");

    if (!level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      });
    }

    const progressBefore = await Progress.findOne(
      { courseId, userId },
      "completedLevels",
    ).populate("completedLevels", "level");

    if (!progressBefore) {
      const progress = await Progress.create({
        courseId,
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
        $addToSet: {
          completedLevels: levelId,
        },
      },
      {
        returnDocument: "after",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Level completed successfully",
      progress,
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

module.exports = {
  watchLevel,
  watchedLevel,
};
