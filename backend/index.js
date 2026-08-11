const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const { sendEmail } = require("./sendEmail");
const users = require("./models/userSchema");
const courses = require("./models/courseSchema");
const levels = require("./models/levlSchema");
const payments = require("./models/paymentSchema");
const { config } = require("dotenv");
config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage });

mongoose
  .connect(
    "mongodb://hamo:mmtt2200@ac-tptzhct-shard-00-00.w8wpu78.mongodb.net:27017,ac-tptzhct-shard-00-01.w8wpu78.mongodb.net:27017,ac-tptzhct-shard-00-02.w8wpu78.mongodb.net:27017/online?ssl=true&replicaSet=atlas-g1o7i9-shard-0&authSource=admin&appName=m0hamed19",
  )
  .then(() => {
    console.log("connect sucsess");
  })
  .catch((e) => {
    console.log(`error with connect db is ${e}`);
  });

app.listen(3000, () => {
  console.log("lam listening in port 3000");
});

app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  name = req.body.name;
  email = req.body.email;
  password = req.body.password;
  phone = req.body.phone;
  role = req.body.role;
  try {
    const newUser = await users.create({
      name: name,
      email: email,
      password: password,
      phone: phone,
      role: role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/login", async (req, res) => {
  email = req.body.email;
  password = req.body.password;

  const user = await users.findOne({ email: email });

  if (user) {
    if (user.password == password) {
      res.status(201).json({
        success: true,
        message: "login susscefly",
        userData: user,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "wrong password",
      });
    }
  } else {
    res.status(500).json({
      success: false,
      error: "user dont esxist",
    });
  }
});

app.post(
  "/addlevel",
  upload.fields([{ name: "video", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { courseId, level, title, description } = req.body;
      let videoPath = "";

      if (req.files && req.files["video"]) {
        videoPath = req.files["video"][0].path.replace(/\\/g, "/");
      }

      const newLevel = await levels.create({
        courseId: courseId,
        level: Number(level),
        title: title,
        video: videoPath,
        description: description,
      });
      const updateCourse = await courses.findByIdAndUpdate(courseId, {
        $inc: { levels: 1 },
      });
      res.status(201).json({
        success: true,
        message: "Level Added Successefully",
        course: newLevel,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

app.post(
  "/addcourse",
  upload.fields([{ name: "photo", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { name, price, description, teacherId } = req.body;

      let pathPhoto = "";
      if (req.files && req.files["photo"]) {
        pathPhoto = req.files["photo"][0].path.replace(/\\/g, "/");
      }

      const newCourse = await courses.create({
        name: name,
        teacherId: teacherId,
        levels: 0,
        price: Number(price) || 0,
        description: description,
        photo: pathPhoto,
      });
      res.status(201).json({
        success: true,
        message: "Course Added Successefully",
        course: newCourse,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

app.get("/courses", async (req, res) => {
  try {
    const allCourses = await courses.find();

    res.status(200).json({
      success: true,
      courses: allCourses,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/course/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await courses.findById(courseId);
    const courselevels = await levels.find({ courseId });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      course: course,
      levels: courselevels,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/mycourses/:id", async (req, res) => {
  try {
    const teacherId = req.params.id;
    const myCourses = await courses.find({ teacherId });

    if (myCourses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Courses not found" });
    }

    res.status(200).json({
      success: true,
      course: myCourses,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/payment/:courseId/:studentId", async (req, res) => {
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

app.get("/mypayments/:studentId", async (req, res) => {
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

app.get("/purchasedcourses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const myPayments = await payments.find({ studentId: id });
    const courseIds = myPayments.map((p) => p.courseId);

    const purchasedCourses = await courses.find({
      _id: { $in: courseIds },
    });
    res.status(200).json({
      success: true,
      myPayments: purchasedCourses,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    await sendEmail({
      from: process.env.email,
      to: process.env.email,
      subject: `Contact Form - ${subject}`,
      html: `
        <h2>New Message</h2>

        <p><strong>Name:</strong> ${name}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Subject:</strong> ${subject}</p>

        <p><strong>Message:</strong></p>

        <p>${message}</p>
      `,
    });

    res.status(200).json({
      message: "Email sent successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to send email",
    });
  }
});
