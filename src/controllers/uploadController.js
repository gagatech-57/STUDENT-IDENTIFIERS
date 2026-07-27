const { getDbStatus } = require("../config/db");
const {
    getUploadedFilesService,
    saveSinglePhotoService,
    saveArrayPhotosService,
    saveFieldsPhotoResumeService,
    deleteUploadedFileService,
    syncUploadsService
} = require("../services/uploadService");
const { syncStudentsService } = require("../services/studentService");

const checkUploadStatus = (req, res) => {
    res.status(200).json({
        message: "Upload Service is working",
        dbStatus: getDbStatus()
    });
};

const getDbStatusController = (req, res) => {
    res.status(200).json({
        message: "Database Connection Status",
        dbStatus: getDbStatus()
    });
};

const syncDatabasesController = async (req, res, next) => {
    try {
        const uploadSync = await syncUploadsService();
        const studentSync = await syncStudentsService();

        return res.status(200).json({
            message: "Dual Database Synchronization Complete",
            uploadSync,
            studentSync,
            dbStatus: getDbStatus()
        });
    } catch (err) {
        next(err);
    }
};

const getUploadedFilesController = async (req, res, next) => {
    try {
        const result = await getUploadedFilesService(req.query.uploadedBy);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch files from database",
            error: err.message
        });
    }
};

const uploadSinglePhotoController = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No photo file provided for upload"
        });
    }

    try {
        const result = await saveSinglePhotoService(req.file, req.body.uploadedBy);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const uploadArrayPhotosController = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            message: "No photo files provided for upload"
        });
    }

    try {
        const result = await saveArrayPhotosService(req.files, req.body.uploadedBy);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const uploadFieldsPhotoResumeController = async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            message: "No files provided for upload"
        });
    }

    try {
        const result = await saveFieldsPhotoResumeService(req.files, req.body.uploadedBy);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const deleteUploadedFileController = async (req, res, next) => {
    try {
        const fileId = req.params.id || req.params.filename;
        const result = await deleteUploadedFileService(fileId);
        return res.status(200).json(result);
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        next(err);
    }
};

module.exports = {
    checkUploadStatus,
    getDbStatusController,
    syncDatabasesController,
    getUploadedFilesController,
    uploadSinglePhotoController,
    uploadArrayPhotosController,
    uploadFieldsPhotoResumeController,
    deleteUploadedFileController
};
