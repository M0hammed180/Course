const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const courseController = require("../controllers/courses.controller");
const verifyToken = require("../middleware/verfiyToken");

router.use(verifyToken);
router.post("/", upload.single("photo"), courseController.addCourse);

router.patch("/edit", upload.single("photo"), courseController.editCourse);

router.delete("/:id", courseController.deleteCourse);

router.get("/", courseController.allCourses);

router.get("/course/:id", courseController.courseDetailes);

router.get("/mycourses/:id", courseController.myCourses);

router.get("/purchasedcourses/:id", courseController.purchasedCourses);

module.exports = router;
