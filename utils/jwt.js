const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "student_portal_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

function generateToken(student) {
    return jwt.sign(
        {
            id: student._id,
            studentId: student.studentId,
            email: student.email
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN
        }
    );
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    generateToken,
    verifyToken
};
