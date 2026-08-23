const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const userRoutes = require("./routes/user.route");
const courseRoute = require("./routes/course.route");
const levelRoute = require("./routes/level.route");
const paymentRoute = require("./routes/payments.route");
const commentRoute = require("./routes/comments.route");
const progressRoute = require("./routes/progress.route");
const quizRoute = require("./routes/quiz.route");

const contact = require("./utils/contact");
const { config } = require("dotenv");
config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//routes
app.use("/user", userRoutes);
app.use("/course", courseRoute);
app.use("/level", levelRoute);
app.use("/payment", paymentRoute);
app.use("/comment", commentRoute);
app.use("/progress", progressRoute);
app.use("/quiz", quizRoute);
app.use("/contact", contact);

// global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || "error",
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connect sucsess");
  })
  .catch((e) => {
    console.log(`error with connect db is ${e}`);
  });

app.listen(process.env.PORT, () => {
  console.log("lam listening in port" + " " + process.env.PORT);
});
