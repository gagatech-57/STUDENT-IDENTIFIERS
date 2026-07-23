const mongoose = require("mongoose");
const Upload = require("../models/Upload");

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/studentdb";

        await mongoose.connect(mongoUri);
        console.log("MongoDB Connected Successfully");

        // Explicitly create uploads collection so it appears immediately in MongoDB Compass
        await Upload.createCollection();
    } catch (err) {
        console.log("MongoDB Connection Failed");
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
