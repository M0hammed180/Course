const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const levelController = require("../controllers/levels.controller");
const verifyToken = require("../middleware/verfiyToken");

router.use(verifyToken);
router.post("/", levelController.Addlevel);
router.patch("/edit", levelController.Editlevel);
router.get("/:id", levelController.showLevel);
router.delete("/:levelId", levelController.Deletelevel);

module.exports = router;
