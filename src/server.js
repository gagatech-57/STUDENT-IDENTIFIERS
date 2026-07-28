require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 3000;

const { syncStudentsService } = require("./services/studentService");
const { syncUploadsService } = require("./services/uploadService");

// Connect to MongoDB Atlas & Local DB, then trigger auto-sync
connectDB().then(async () => {
    try {
        await Promise.all([
            syncStudentsService(),
            syncUploadsService()
        ]);
        console.log("Dual MongoDB Auto-Sync Completed Successfully!");
    } catch (e) {
        console.warn("Auto-sync warning:", e.message);
    }
}).catch(() => {});

// Start HTTP Server
app.listen(PORT, () => {
    console.log(`Server Running Successfully on PORT ${PORT}!`);
});
