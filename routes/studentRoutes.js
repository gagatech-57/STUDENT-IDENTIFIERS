const express = require("express");
const router = express.Router();
const {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");
const protect = require("../middleware/authMiddleware");
const {
    createStudentValidator,
    updateStudentValidator
} = require("../validators/studentValidator");
const validate = require("../middleware/validateMiddleware");

router.post("/", createStudentValidator, validate, createStudent);
router.get("/", protect, getStudents);
router.get("/:studentId", protect, getStudentById);
router.put("/:studentId", protect, updateStudentValidator, validate, updateStudent);
router.delete("/:studentId", protect, deleteStudent);

module.exports = router;
