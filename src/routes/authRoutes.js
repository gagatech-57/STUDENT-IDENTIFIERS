const express = require("express");
const router = express.Router();
const { loginStudent, registerStudent } = require("../controllers/authController");
const { loginValidator } = require("../validators/authValidator");
const validate = require("../middleware/validateMiddleware");

router.post("/login", loginValidator, validate, loginStudent);
router.post("/register", registerStudent);

module.exports = router;
