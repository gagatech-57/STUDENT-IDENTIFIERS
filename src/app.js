const path = require("path");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Configure CORS
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "https://server-testing-skra.onrender.com"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets & uploaded files
const publicPath = path.join(__dirname, "public");
const uploadsPath = path.join(__dirname, "uploads");

app.use(express.static(publicPath));
app.use("/uploads", express.static(uploadsPath));

// Static index HTML route
app.get(["/", "/login"], (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

// Test endpoint
app.get("/test", (req, res) => {
    res.json({
        message: "Server is Working"
    });
});

// API Routes
app.use("/", authRoutes);
app.use("/students", studentRoutes);
app.use("/upload", uploadRoutes);

// 404 Route Not Found Middleware
app.use(notFound);

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
