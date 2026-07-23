const express = require("express");
const router = express.Router();
const { loginStudent } = require("../controllers/authController");
const { loginValidator } = require("../validators/authValidator");
const validate = require("../middleware/validateMiddleware");

router.post("/login", loginValidator, validate, loginStudent);

module.exports = router;
