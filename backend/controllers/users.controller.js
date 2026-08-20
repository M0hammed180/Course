const users = require("../models/userSchema");
const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png";

const register = asyncWrapper(async (req, res) => {
  name = req.body.name;
  email = req.body.email;
  password = req.body.password;
  phone = req.body.phone;
  role = req.body.role;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await users.create({
    name: name,
    email: email,
    password: hashedPassword,
    phone: phone,
    role: role,
    avatar: req.file?.path || DEFAULT_AVATAR,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: newUser,
  });
});

const login = asyncWrapper(async (req, res) => {
  email = req.body.email;
  password = req.body.password;

  const user = await users.findOne({ email: email });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User does not exist",
    });
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    return res.status(400).json({
      success: false,
      error: "Wrong password",
    });
  }

  const token = await jwt.sign(
    {
      _id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar || DEFAULT_AVATAR,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" },
  );

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
  });
});

const edit = asyncWrapper(async (req, res) => {
  const { userId, name, phone, email, password } = req.body;
  const update = {
    name,
    phone,
    email,
  };
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    update.password = hashedPassword;
  }
  if (req.file) {
    update.avatar = req.file.path;
  }

  const editedUser = await users.findByIdAndUpdate(userId, update, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: "User edited successfully",
    user: editedUser,
  });
});

module.exports = { register, login, edit };
