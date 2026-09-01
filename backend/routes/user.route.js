const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const verifyToken = require("../middleware/verfiyToken");

const userController = require("../controllers/users.controller");

router.post("/register", upload.single("photo"), userController.register);
router.post("/login", userController.login);
router.patch("/edit",verifyToken, upload.single("photo"), userController.edit);

module.exports = router;
