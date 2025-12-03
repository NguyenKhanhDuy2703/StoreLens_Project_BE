const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

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

// Upload single file
const mwHandleUploadSingle = (req, res, next) => {
  
 console.log("File uploaded to Cloudinary:", req.file);

  upload.single("background_image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: "Upload failed",
        error: err.message,
      });
    }
    
    // Nếu có file thì thêm URL Cloudinary vào req.body
    if (req.file) {
      req.body.ImageURL = req.file.path; 
    }

    next();
  });
};

module.exports = { mwHandleUploadSingle };
