const bcrypt = require("bcrypt");
const Student = require("../models/Student");
const { generateToken } = require("../utils/jwt");
const formatStudentResponse = require("../utils/studentResponse");

const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email: email ? email.toLowerCase().trim() : "" });

        if (!student) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }

        const passwordMatches = await bcrypt.compare(password, student.password);

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }

        res.json({
            message: "Login Successful",
            token: generateToken(student),
            student: formatStudentResponse(student)
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const registerStudent = async (req, res) => {
    try {
        const { name, age, department, email, password } = req.body;

        if (!name || !age || !department || !email || !password) {
            return res.status(400).json({
                message: "All fields (Name, Age, Department, Email, Password) are required"
            });
        }

        const existingStudent = await Student.findOne({ email: email.toLowerCase().trim() });
        if (existingStudent) {
            return res.status(400).json({
                message: "Account with this email already exists! Please login."
            });
        }

        const count = await Student.countDocuments();
        const studentId = String(count + 101);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = new Student({
            studentId,
            name: name.trim().toUpperCase(),
            age: Number(age),
            department: department.trim().toUpperCase(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        await newStudent.save();

        const token = generateToken(newStudent);
        const formatted = formatStudentResponse(newStudent);

        res.status(201).json({
            message: "Account Created Successfully!",
            token,
            student: formatted
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Failed to create account"
        });
    }
};

module.exports = {
    loginStudent,
    registerStudent
};
