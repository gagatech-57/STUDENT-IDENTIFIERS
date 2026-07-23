const mongoose = require("mongoose");
const Upload = require("../models/Upload");

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb+srv://gunaknn_db_user:cwAb5daLLEmtNwto@cluster0.mh22i0y.mongodb.net/studentdb?retryWrites=true&w=majority";

        await mongoose.connect(mongoUri);
        console.log("MongoDB Atlas Connected Successfully");

        await Upload.createCollection().catch(() => {});
    } catch (err) {
        console.log("MongoDB Connection Failed");
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
