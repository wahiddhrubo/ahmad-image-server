const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();

const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, next) => {
			const { filePath } = req.params;
			const imageUploadPath = `/test/uploads/`;
			// const imageUploadPath = `/uploads/products/${filePath}`;
			// fs.mkdirSync(imageUploadPath, { recursive: true });
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

module.exports = router;
