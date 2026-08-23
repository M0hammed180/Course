const Quiz = require("../models/quizSchema");
const Score = require("../models/scoreSchema");
const Progress = require("../models/progressSchema");
const asyncWrapper = require("../middleware/asyncWrapper");

const quistionQuiz = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(
    id,
    "-questions.correctAnswer -questions.points",
  );

  await res.status(200).json({
    success: true,
    quiz,
  });
});

const calcScore = asyncWrapper(async (req, res) => {
  const { userId, quizId, answers } = req.body;

  const correctAnswer = await Quiz.findById(quizId, "questions.correctAnswer");
  const totalScore = correctAnswer.questions.length;

  let score = 0;

  correctAnswer.questions.forEach((q, index) => {
    if (answers[index] === q.correctAnswer) {
      score += 1;
    }
  });
  const createdScore = await Score.findOneAndUpdate(
    {
      userId,
      quizId,
    },
    {
      $set: {
        score,
        totalScore,
      },
    },
    {
      new: true,
      upsert: true,
    },
  );
  res.status(200).json({
    success: true,
    createdScore,
  });
});

const getScore = asyncWrapper(async (req, res) => {
  const { userId, quizId } = req.params;

  let score = await Score.findOne({ userId, quizId }, "score totalScore");
  if (!score) {
    score = "no score";
  }
  await res.status(200).json({
    success: true,
    score,
  });
});

module.exports = {
  quistionQuiz,
  calcScore,
  getScore,
};
