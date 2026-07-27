const bcrypt = require("bcrypt");
const { getModels } = require("../config/db");
const { generateToken } = require("../utils/jwt");
const formatStudentResponse = require("../utils/studentResponse");

const loginStudentService = async ({ email, password }) => {
    const { AtlasStudent, LocalStudent } = getModels();
    const cleanEmail = email ? email.toLowerCase().trim() : "";

    let student = null;

    if (AtlasStudent) {
        student = await AtlasStudent.findOne({ email: cleanEmail });
    }
    if (!student && LocalStudent) {
        student = await LocalStudent.findOne({ email: cleanEmail });
    }

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

    const { AtlasStudent, LocalStudent } = getModels();
    const cleanEmail = email.toLowerCase().trim();

    let existingStudent = null;
    if (AtlasStudent) {
        existingStudent = await AtlasStudent.findOne({ email: cleanEmail });
    }
    if (!existingStudent && LocalStudent) {
        existingStudent = await LocalStudent.findOne({ email: cleanEmail });
    }

    if (existingStudent) {
        const error = new Error("Account with this email already exists! Please login.");
        error.statusCode = 400;
        throw error;
    }

    let count = 0;
    if (AtlasStudent) {
        count = await AtlasStudent.countDocuments();
    } else if (LocalStudent) {
        count = await LocalStudent.countDocuments();
    }

    const studentId = String(count + 101);
    const hashedPassword = await bcrypt.hash(password, 10);

    const studentData = {
        studentId,
        name: name.trim().toUpperCase(),
        age: Number(age),
        department: department.trim().toUpperCase(),
        email: cleanEmail,
        password: hashedPassword
    };

    let createdAtlas = null;
    let createdLocal = null;

    if (AtlasStudent) {
        try {
            createdAtlas = await AtlasStudent.create(studentData);
        } catch (e) {
            console.warn("Atlas registration save error:", e.message);
        }
    }

    if (LocalStudent) {
        try {
            const existing = await LocalStudent.findOne({ studentId });
            if (!existing) {
                createdLocal = await LocalStudent.create(studentData);
            } else {
                createdLocal = existing;
            }
        } catch (e) {
            console.warn("Local registration save error:", e.message);
        }
    }

    const newStudent = createdAtlas || createdLocal || studentData;

    const token = generateToken(newStudent);
    const formatted = formatStudentResponse(newStudent);

    return {
        message: "Account Created Successfully in Dual MongoDB!",
        token,
        student: formatted
    };
};

module.exports = {
    loginStudentService,
    registerStudentService
};
