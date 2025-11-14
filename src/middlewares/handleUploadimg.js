const multer  = require("multer")
const fs = require("fs")
const path = require("path")
require('dotenv').config()
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');


// cau hinh cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
      folder: 'uploads',
      format: file.mimetype === 'image/png' ? 'png' : 'webp', // Giữ nguyên PNG, còn lại là WebP
      transformation: [{ width: 800, crop: 'limit' }],
    }),
  });
  

  const upload = multer({ storage: storage });

  const uploadSingle = upload.single('image')
  const mwHandleUpdloadSingle = async (req , res , next ) => {
    uploadSingle(req, res, (err) => {
        if (err) {
            console.log(err);
          return res.status(400).json({ message: 'Lỗi upload ảnh', error: err.message });
        }
        req.body.ImageURL = req.file.path;
        next();
      });
  };

  
  module.exports = { mwHandleUpdloadSingle };