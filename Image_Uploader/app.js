require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "frontend")));

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Multer storage setup for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads", // Folder in Cloudinary
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});

const upload = multer({ storage: storage });

// Image upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ url: req.file.path });
});

// Serve frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
