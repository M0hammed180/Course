const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "courses",
    resource_type: "auto", 
    allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi"], 
  },
});

const upload = multer({ storage });
module.exports = { upload };