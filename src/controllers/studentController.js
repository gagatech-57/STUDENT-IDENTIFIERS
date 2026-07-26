const {
    getAllStudentsService,
    getStudentByIdService,
    createStudentService,
    updateStudentService,
    deleteStudentService
} = require("../services/studentService");

const getStudents = async (req, res, next) => {
    try {
        const students = await getAllStudentsService();
        return res.status(200).json(students);
    } catch (err) {
        next(err);
    }
};

const getStudentById = async (req, res, next) => {
    try {
        const student = await getStudentByIdService(req.params.studentId);
        return res.status(200).json(student);
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        next(err);
    }
};

const createStudent = async (req, res, next) => {
    try {
        const result = await createStudentService(req.body);
        return res.status(201).json(result);
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        next(err);
    }
};

const updateStudent = async (req, res, next) => {
    try {
        const result = await updateStudentService(req.params.studentId, req.body);
        return res.status(200).json(result);
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        next(err);
    }
};

const deleteStudent = async (req, res, next) => {
    try {
        const result = await deleteStudentService(req.params.studentId);
        return res.status(200).json(result);
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        next(err);
    }
};

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};
