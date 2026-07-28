const {
    loginStudentService,
    registerStudentService,
    changePasswordService
} = require("../services/authService");

const loginStudent = async (req, res, next) => {
    try {
        const result = await loginStudentService(req.body);
        return res.status(200).json(result);
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        next(err);
    }
};

const registerStudent = async (req, res, next) => {
    try {
        const result = await registerStudentService(req.body);
        return res.status(201).json(result);
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        next(err);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const result = await changePasswordService(req.body);
        return res.status(200).json(result);
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        next(err);
    }
};

module.exports = {
    loginStudent,
    registerStudent,
    changePassword
};
