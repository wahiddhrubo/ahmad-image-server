const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

//FOR TESTING
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();

const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, next) => {
			const { filePath } = req.params;

			const imageUploadPath = `/uploads/products/${filePath}`;
			fs.mkdirSync(imageUploadPath, { recursive: true });
			return next(null, imageUploadPath);
		},
		filename: (req, file, next) => {
			next(null, Date.now() + path.extname(file.originalname));
		},
	}),
});

// UPLOAD SINGLE IMAGE
router.post(
	"/upload/single/:filePath",
	upload.single("image"),
	(req, res, next) => {
		const public_id = `${req.protocol}://${req.get("host")}`;
		const url = `${public_id}/${req.file.path.replace(/\\/g, "/")}`;
		const imageUri = {
			public_id,
			url,
			created_at: new Date(),
		};
		res.header("Access-Control-Allow-Origin", "*");
		res.send({ success: true, imageUri });
	}
);

//FOR TESTING
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

//FOR TESTING
const testStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "Ahmad",
	},
});
const testUpload = multer({ storage: testStorage });

//FOR TESTING
router.post("/test/upload", testUpload.single("image"), async (req, res) => {
	const imageUri = {
		public_id: "https://res.cloudinary.com",
		url: req.file.path,
		created_at: new Date(),
	};
	return res.json({ success: true, imageUri });
});

module.exports = router;
