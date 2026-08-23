const express = require("express");
const router = express.Router();

const progressController = require("../controllers/progress.controller");

router.post("/complete", progressController.watchLevel);
router.get("/lastlevel/:courseId/:userId", progressController.watchedLevel);

module.exports = router;
