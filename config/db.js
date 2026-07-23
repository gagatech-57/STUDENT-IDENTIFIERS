const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/studentdb";

        await mongoose.connect(mongoUri);
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.log("MongoDB Connection Failed");
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
