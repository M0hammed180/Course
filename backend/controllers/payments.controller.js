const payments = require("../models/paymentSchema");
const asyncWrapper = require("../middleware/asyncWrapper");

const myPayments = asyncWrapper(async  (req, res) => {
  try {
    const { studentId } = req.params;
    const myPayments = await payments.find({ studentId });
    res.status(200).json({
      success: true,
      myPayments: myPayments,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const payment = asyncWrapper(async  (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    const newPayment = await payments.create({
      courseId,
      studentId,
    });

    res.status(200).json({
      success: true,
      newPayment: newPayment,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = { myPayments, payment };
