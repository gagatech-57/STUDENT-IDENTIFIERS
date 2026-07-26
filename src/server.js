require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
connectDB();

// Start HTTP Server
app.listen(PORT, () => {
    console.log(`Server Running Successfully on PORT ${PORT}!`);
});
