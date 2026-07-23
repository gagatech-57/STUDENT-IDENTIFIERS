const bcrypt = require("bcrypt");
const Student = require("../models/Student");
const { generateToken } = require("../utils/jwt");
const formatStudentResponse = require("../utils/studentResponse");

const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(401).json({message: "Invalid Email or Password"
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

module.exports = {
    loginStudent
};
