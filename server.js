require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const notFound = require("./middleware/notFound");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get(["/", "/login"], (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/test", (req, res) => {
    res.json({
        message: "Server is Working"
    });
});

app.use("/", authRoutes);
app.use("/students", studentRoutes);
app.use("/upload", uploadRoutes);

app.use(notFound);

app.listen(PORT, () => {
    console.log(`Server Running Successfully on PORT ${PORT}!`);
});