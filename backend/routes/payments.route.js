const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/payments.controller");

router.post("/:courseId/:studentId", paymentsController.payment);

router.get("/:studentId", paymentsController.myPayments);

module.exports = router;
