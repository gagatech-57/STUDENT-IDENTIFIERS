const mongoose = require("mongoose");
const { uploadSchema } = require("../models/Upload");
const { studentSchema } = require("../models/Student");

const dbStatus = {
    atlas: { connected: false, host: null, error: null },
    local: { connected: false, host: null, error: null }
};

let localConn = null;
let isConnectingPromise = null;

const connectDB = async () => {
    // If Atlas is already connected, reuse connection instantly
    if (dbStatus.atlas.connected && mongoose.connection.readyState === 1) {
        return;
    }

    if (isConnectingPromise) {
        return isConnectingPromise;
    }

    isConnectingPromise = (async () => {
        const localUri = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/studentdb";
        const atlasUri = process.env.MONGO_URI || localUri;

        const isVercel = !!process.env.VERCEL;

        // 1. Connect to Online MongoDB Atlas
        try {
            if (mongoose.connection.readyState !== 1) {
                await mongoose.connect(atlasUri, { serverSelectionTimeoutMS: 5000 });
            }
            dbStatus.atlas.connected = true;
            dbStatus.atlas.host = mongoose.connection.host;
            dbStatus.atlas.error = null;
            console.log(`Online MongoDB Atlas Connected Successfully [${dbStatus.atlas.host}]`);
        } catch (atlasErr) {
            dbStatus.atlas.connected = false;
            dbStatus.atlas.host = null;
            dbStatus.atlas.error = atlasErr.message;
            console.error(`Online MongoDB Atlas Connection Failed: ${atlasErr.message}`);
        }

        // 2. Connect to Local MongoDB (only if NOT in Vercel cloud environment)
        if (!isVercel) {
            try {
                if (!localConn || localConn.readyState !== 1) {
                    localConn = mongoose.createConnection(localUri, { serverSelectionTimeoutMS: 2000 });
                    await new Promise((resolve) => {
                        localConn.once("open", () => {
                            dbStatus.local.connected = true;
                            dbStatus.local.host = localConn.host;
                            dbStatus.local.error = null;
                            console.log(`Local MongoDB Connected Successfully [${dbStatus.local.host}]`);
                            resolve();
                        });
                        localConn.once("error", (err) => {
                            dbStatus.local.connected = false;
                            dbStatus.local.host = null;
                            dbStatus.local.error = err.message;
                            console.error(`Local MongoDB Connection Failed: ${err.message}`);
                            resolve();
                        });
                    });
                }
            } catch (localErr) {
                dbStatus.local.connected = false;
                dbStatus.local.host = null;
                dbStatus.local.error = localErr.message;
                console.error(`Local MongoDB Connection Failed: ${localErr.message}`);
            }

            // Register models on local connection if open
            if (dbStatus.local.connected && localConn) {
                try {
                    if (!localConn.models["Upload"]) {
                        localConn.model("Upload", uploadSchema);
                    }
                    if (!localConn.models["Student"]) {
                        localConn.model("Student", studentSchema);
                    }
                } catch (e) {
                    // silent catch
                }
            }
        }
    })();

    try {
        await isConnectingPromise;
    } finally {
        isConnectingPromise = null;
    }
};

const getDbStatus = () => ({
    atlas: { ...dbStatus.atlas },
    local: { ...dbStatus.local }
});

const getModels = () => {
    const UploadModel = require("../models/Upload");
    const StudentModel = require("../models/Student");

    const AtlasUpload = dbStatus.atlas.connected ? UploadModel : null;
    const AtlasStudent = dbStatus.atlas.connected ? StudentModel : null;

    let LocalUpload = null;
    let LocalStudent = null;

    if (dbStatus.local.connected && localConn) {
        try {
            LocalUpload = localConn.models["Upload"] || localConn.model("Upload", uploadSchema);
            LocalStudent = localConn.models["Student"] || localConn.model("Student", studentSchema);
        } catch (e) {
            // silent catch
        }
    }

    return {
        AtlasUpload,
        LocalUpload,
        AtlasStudent,
        LocalStudent
    };
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.getDbStatus = getDbStatus;
module.exports.getModels = getModels;
