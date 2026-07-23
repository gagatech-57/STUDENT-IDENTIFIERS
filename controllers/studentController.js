const bcrypt = require("bcrypt");
const Student = require("../models/Student");

const getStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ studentId: 1 });

        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const getStudentById = async (req, res) => {
    try {
        const student = await Student.findOne({
            studentId: req.params.studentId
        });

        if (!student) {
            return res.status(404).json({
                message: "Student Not Found"
            });
        }

        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const createStudent = async (req, res) => {
    try {
        const password = req.body.password || "";

        if (password.length < 5 || password.length > 72) {
            return res.status(400).json({
                message: "Password must be between 5 and 72 characters"
            });
        }

        const count = await Student.countDocuments();
        const hashedPassword = await bcrypt.hash(password, 10);

        const student = new Student({
            studentId: String(count + 1).padStart(2, "0"),
            name: req.body.name,
            age: req.body.age,
            department: req.body.department,
            email: req.body.email,
            password: hashedPassword
        });

        await student.save();

        res.status(201).json({
            message: "Student Added Successfully",
            student
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const updateStudent = async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate(
            {
                studentId: req.params.studentId
            },
            {
                name: req.body.name,
                age: req.body.age,
                department: req.body.department,
                email: req.body.email
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student Not Found"
            });
        }

        res.status(200).json({
            message: "Student Updated Successfully",
            student
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findOneAndDelete({
            studentId: req.params.studentId
        });

        if (!student) {
            return res.status(404).json({
                message: "Student Not Found"
            });
        }

        res.status(200).json({
            message: "Student Deleted Successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};
