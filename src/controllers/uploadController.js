const {
    getUploadedFilesService,
    saveSinglePhotoService,
    saveArrayPhotosService,
    saveFieldsPhotoResumeService
} = require("../services/uploadService");

const checkUploadStatus = (req, res) => {
    res.status(200).json({
        message: "Upload is working"
    });
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

module.exports = {
    checkUploadStatus,
    getUploadedFilesController,
    uploadSinglePhotoController,
    uploadArrayPhotosController,
    uploadFieldsPhotoResumeController
};
