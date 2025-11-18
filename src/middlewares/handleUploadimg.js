const multer  = require("multer")
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
    folder: "uploads",
    format: file.mimetype === "image/png" ? "png" : "webp",
    transformation: [{ width: 800, crop: "limit" }],
  }),
});

const upload = multer({ storage });

const uploadSingle = upload.single("backgroundImage");

const mwHandleUploadSingle = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(400).json({
        message: "Image upload failed",
        error: err.message,
      });
    }

    if (req.file) {
      req.body.ImageURL = req.file.path; // URL từ Cloudinary
    }

    next();
  });
};

module.exports = { mwHandleUploadSingle };
