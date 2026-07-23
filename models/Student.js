const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 23
    },
    department: {
        type: String,
        required: true,
        uppercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: true,
        minlength: 60,
        maxlength: 72
    }
});

module.exports = mongoose.model("Student", studentSchema);
