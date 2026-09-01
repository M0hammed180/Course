const asyncWrapper = require("../middleware/asyncWrapper");
const Comment = require("../models/commentSchema");

const addComment = asyncWrapper(async (req, res) => {
  const { courseId, userId, text } = req.body;
  await Comment.create({ courseId, userId, text });
  res.status(201).json({
    success: true,
    message: "Comment Added Successefully",
  });
});

const deleteComment = asyncWrapper(async (req, res) => {
  const { commentId } = req.params;
  await Comment.findByIdAndDelete(commentId);
  res.status(201).json({
    success: true,
    message: "Comment Added Successefully",
  });
});

const editComment = asyncWrapper(async (req, res) => {
  const { commentId, text } = req.body;
  await Comment.findByIdAndUpdate(commentId, { text, updated: true });
  res.status(201).json({
    success: true,
    message: "Comment Added Successefully",
  });
});

const viewComments = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const comments = await Comment.find({ courseId: id }).populate(
    "userId",
    "name avatar",
  );
  res.status(201).json({
    success: true,
    comments,
  });
});

const viewAllComments = asyncWrapper(async (req, res) => {
  const comments = await Comment.find()
    .populate("userId", "name avatar")
    .populate("courseId", "name")
    .limit(2);
  res.status(201).json({
    success: true,
    comments,
  });
});

module.exports = {
  addComment,
  deleteComment,
  editComment,
  viewComments,
  viewAllComments,
};
