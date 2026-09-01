const Quiz = require("../models/quizSchema");
const Score = require("../models/scoreSchema");
const asyncWrapper = require("../middleware/asyncWrapper");

const quistionQuiz = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const quiz = await Quiz.findById(
    id,
    "-questions.correctAnswer -questions.points",
  );

  res.status(200).json({
    success: true,
    quiz,
  });
});

const calcScore = asyncWrapper(async (req, res) => {
  const { userId, quizId, answers, timeFinished } = req.body;

  const quiz = await Quiz.findById(
    quizId,
    "questions.correctAnswer questions._id",
  );

  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: "Quiz not found",
    });
  }

  if (!answers || answers.length !== quiz.questions.length) {
    return res.status(400).json({
      success: false,
      message: "Invalid answers",
    });
  }

  const totalScore = quiz.questions.length;

  let score = 0;
  const incorrectQuestions = [];

  quiz.questions.forEach((q, index) => {
    const userAnswer = answers[index];

    if (userAnswer.optionIndex === q.correctAnswer) {
      score += 1;
    } else {
      incorrectQuestions.push({
        questionId: q._id,
        wrongAnswer: userAnswer.optionIndex,
        correctAnswer: q.correctAnswer,
      });
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
        userId,
        quizId,
        timeFinished,
        incorrectQuestions,
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
    answers,
    incorrectQuestions,
  });
});

const getScore = asyncWrapper(async (req, res) => {
  const { userId, quizId } = req.params;

  const score = await Score.findOne({ userId, quizId }, "score totalScore ");

  res.status(200).json({
    success: true,
    score: score || "no score",
  });
});

const getMyAnswers = asyncWrapper(async (req, res) => {
  const { userId, quizId } = req.params;

  const questions = await Quiz.findById(quizId, "questions timeLimit");

  const score = await Score.findOne(
    { userId, quizId },
    "score totalScore incorrectQuestions timeFinished",
  );

  res.status(200).json({
    success: true,
    score: score,
    questions,
  });
});

module.exports = {
  quistionQuiz,
  calcScore,
  getScore,
  getMyAnswers,
};
