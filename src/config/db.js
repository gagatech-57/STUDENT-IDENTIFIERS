const mongoose = require("mongoose");
const Upload = require("../models/Upload");

const connectDB = async () => {
    const localUri = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/studentdb";
    const atlasUri = process.env.MONGO_URI || "mongodb+srv://gunaknn_db_user:cwAb5daLLEmtNwto@cluster0.mh22i0y.mongodb.net/studentdb?retryWrites=true&w=majority";

    const targetUri = process.env.USE_LOCAL_DB === "true" ? localUri : atlasUri;

    try {
        await mongoose.connect(targetUri);
        const host = mongoose.connection.host;
        console.log(`MongoDB Connected Successfully to [${host}]`);
        await Upload.createCollection().catch(() => {});
    } catch (err) {
        console.warn(`Primary MongoDB Connection Failed (${targetUri}): ${err.message}`);

        // Fallback to local MongoDB if primary Atlas connection fails
        if (targetUri !== localUri) {
            console.log(`Attempting fallback to Local MongoDB (${localUri})...`);
            try {
                await mongoose.connect(localUri);
                console.log(`Connected to Local MongoDB Successfully at [${mongoose.connection.host}]`);
                await Upload.createCollection().catch(() => {});
                return;
            } catch (localErr) {
                console.error(`Local MongoDB Connection Failed: ${localErr.message}`);
            }
        }
        process.exit(1);
    }
};

module.exports = connectDB;
