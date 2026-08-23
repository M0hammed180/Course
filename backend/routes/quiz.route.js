const express = require("express");
const router = express.Router();

const quizController = require("../controllers/quiz.controller");

router.get("/quiz/:id", quizController.quistionQuiz);
router.get("/score/:userId/:quizId", quizController.getScore);
router.post("/submit", quizController.calcScore);

module.exports = router;
