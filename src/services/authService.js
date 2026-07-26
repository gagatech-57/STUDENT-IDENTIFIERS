const bcrypt = require("bcrypt");
const Student = require("../models/Student");
const { generateToken } = require("../utils/jwt");
const formatStudentResponse = require("../utils/studentResponse");

const loginStudentService = async ({ email, password }) => {
    const student = await Student.findOne({ email: email ? email.toLowerCase().trim() : "" });

    if (!student) {
        const error = new Error("Invalid Email or Password");
        error.statusCode = 401;
        throw error;
    }

    const passwordMatches = await bcrypt.compare(password, student.password);
    if (!passwordMatches) {
        const error = new Error("Invalid Email or Password");
        error.statusCode = 401;
        throw error;
    }

    return {
        message: "Login Successful",
        token: generateToken(student),
        student: formatStudentResponse(student)
    };
};

const registerStudentService = async ({ name, age, department, email, password }) => {
    if (!name || !age || !department || !email || !password) {
        const error = new Error("All fields (Name, Age, Department, Email, Password) are required");
        error.statusCode = 400;
        throw error;
    }

    const existingStudent = await Student.findOne({ email: email.toLowerCase().trim() });
    if (existingStudent) {
        const error = new Error("Account with this email already exists! Please login.");
        error.statusCode = 400;
        throw error;
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

    return {
        message: "Account Created Successfully!",
        token,
        student: formatted
    };
};

module.exports = {
    loginStudentService,
    registerStudentService
};
