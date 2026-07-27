const path = require("path");
const fs = require("fs");
const os = require("os");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Configure CORS for local, render, and vercel deployments
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resolve static public directory
let publicPath = path.join(__dirname, "public");
if (!fs.existsSync(publicPath)) {
    publicPath = path.resolve(process.cwd(), "src", "public");
}
if (!fs.existsSync(publicPath)) {
    publicPath = path.resolve(process.cwd(), "public");
}

// Resolve uploads directory
const isVercel = !!process.env.VERCEL;
const uploadsPath = isVercel ? path.join(os.tmpdir(), "uploads") : path.join(__dirname, "uploads");

app.use(express.static(publicPath));
app.use("/uploads", express.static(uploadsPath));

// Static index HTML route
app.get(["/", "/login"], (req, res) => {
    const indexPath = path.join(publicPath, "index.html");
    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }
    return res.status(200).send("Student Portal API & UI is online");
});

// Test endpoint
app.get("/test", (req, res) => {
    res.json({
        message: "Server is Working",
        environment: isVercel ? "Vercel Serverless" : "Standard Node.js Server"
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
