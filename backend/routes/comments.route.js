const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");

router.post("/", commentController.addComment);
router.patch("/", commentController.editComment);
router.delete("/:commentId", commentController.deleteComment);
router.get("/:id", commentController.viewComments);
router.get("/", commentController.viewAllComments);

module.exports = router;
