const express = require("express");
const router = express.Router();

const progressController = require("../controllers/progress.controller");
const verifyToken = require("../middleware/verfiyToken");

router.use(verifyToken);
router.post("/complete", progressController.watchLevel);
router.get("/lastlevel/:courseId/:userId", progressController.watchedLevel);
router.get("/myachievements/:userId", progressController.myAchievements);
router.get("/mycompletecourses/:userId", progressController.mycompleteCourses);
router.get(
  "/studentachivmentforeacher/:userId/:pageCourse/:pageQuiz/:pageStudent",
  progressController.studentAchivmentForTeacher,
);
router.get(
  "/mystudentinmycourse/:courseId",
  progressController.myStudentInMyCourse,
);
router.get("/mystudentquizzes/:quizId", progressController.myStudentQuizzes);
router.get("/comments/:userId", progressController.myStudentComments);

module.exports = router;
