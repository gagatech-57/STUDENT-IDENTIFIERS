const bcrypt = require("bcrypt");
const Student = require("../models/Student");

const getAllStudentsService = async () => {
    return await Student.find().sort({ studentId: 1 });
};

const getStudentByIdService = async (studentId) => {
    const student = await Student.findOne({ studentId });
    if (!student) {
        const error = new Error("Student Not Found");
        error.statusCode = 404;
        throw error;
    }
    return student;
};

const createStudentService = async ({ name, age, department, email, password }) => {
    const pwd = password || "";
    if (pwd.length < 5 || pwd.length > 72) {
        const error = new Error("Password must be between 5 and 72 characters");
        error.statusCode = 400;
        throw error;
    }

    const count = await Student.countDocuments();
    const hashedPassword = await bcrypt.hash(pwd, 10);

    const student = new Student({
        studentId: String(count + 1).padStart(2, "0"),
        name,
        age,
        department,
        email,
        password: hashedPassword
    });

    await student.save();

    return {
        message: "Student Added Successfully",
        student
    };
};

const updateStudentService = async (studentId, { name, age, department, email }) => {
    const student = await Student.findOneAndUpdate(
        { studentId },
        { name, age, department, email },
        { new: true, runValidators: true }
    );

    if (!student) {
        const error = new Error("Student Not Found");
        error.statusCode = 404;
        throw error;
    }

    return {
        message: "Student Updated Successfully",
        student
    };
};

const deleteStudentService = async (studentId) => {
    const student = await Student.findOneAndDelete({ studentId });
    if (!student) {
        const error = new Error("Student Not Found");
        error.statusCode = 404;
        throw error;
    }

    return {
        message: "Student Deleted Successfully"
    };
};

module.exports = {
    getAllStudentsService,
    getStudentByIdService,
    createStudentService,
    updateStudentService,
    deleteStudentService
};
