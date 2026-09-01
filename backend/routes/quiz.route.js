const express = require("express");
const router = express.Router();

const quizController = require("../controllers/quiz.controller");
const verifyToken = require("../middleware/verfiyToken");

router.use(verifyToken);
router.get("/quiz/:id", quizController.quistionQuiz);
router.get("/score/:userId/:quizId", quizController.getScore);
router.get("/myanswers/:userId/:quizId", quizController.getMyAnswers);
router.post("/submit", quizController.calcScore);

module.exports = router;
