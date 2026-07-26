const { body } = require("express-validator");

const createStudentValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 3, max: 20 }).withMessage("Name must be between 3 and 20 characters"),
    body("age")
        .notEmpty().withMessage("Age is required")
        .isInt({ min: 18, max: 23 }).withMessage("Age must be an integer between 18 and 23"),
    body("department")
        .trim()
        .notEmpty().withMessage("Department is required"),
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email address")
        .normalizeEmail(),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 5, max: 72 }).withMessage("Password must be between 5 and 72 characters")
];

const updateStudentValidator = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 }).withMessage("Name must be between 3 and 20 characters"),
    body("age")
        .optional()
        .isInt({ min: 18, max: 23 }).withMessage("Age must be an integer between 18 and 23"),
    body("department")
        .optional()
        .trim()
        .notEmpty().withMessage("Department cannot be empty"),
    body("email")
        .optional()
        .trim()
        .isEmail().withMessage("Please enter a valid email address")
        .normalizeEmail()
];

module.exports = {
    createStudentValidator,
    updateStudentValidator
};
