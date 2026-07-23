const Upload = require("../models/Upload");

const formatFileDetails = (file, uploadedBy = "Guest") => ({
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    url: `/uploads/${file.filename}`,
    uploadedBy: uploadedBy,
    uploadedAt: new Date()
});

const checkUploadStatus = (req, res) => {
    res.status(200).json({
        message: "Upload is working"
    });
};

const getUploadedFilesController = async (req, res) => {
    try {
        const query = {};
        if (req.query.uploadedBy) {
            query.uploadedBy = req.query.uploadedBy.toLowerCase().trim();
        }

        const files = await Upload.find(query).sort({ uploadedAt: -1 }).limit(50);
        res.status(200).json({
            message: "Uploaded files fetched successfully from MongoDB",
            count: files.length,
            files: files
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch files from database",
            error: error.message
        });
    }
};

const uploadSinglePhotoController = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No photo file provided for upload"
        });
    }

    const uploadedBy = req.body.uploadedBy ? req.body.uploadedBy.toLowerCase().trim() : "Guest";
    const fileData = formatFileDetails(req.file, uploadedBy);

    try {
        const savedFile = await Upload.create(fileData);

        return res.status(200).json({
            message: "Upload is working! Photo uploaded and saved to MongoDB successfully",
            file: savedFile
        });
    } catch (error) {
        return res.status(200).json({
            message: "Upload is working! Photo uploaded successfully",
            file: fileData,
            dbError: error.message
        });
    }
};

const uploadArrayPhotosController = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            message: "No photo files provided for upload"
        });
    }

    const uploadedBy = req.body.uploadedBy ? req.body.uploadedBy.toLowerCase().trim() : "Guest";
    const filesDetails = req.files.map(f => formatFileDetails(f, uploadedBy));

    try {
        const savedFiles = await Upload.insertMany(filesDetails);

        return res.status(200).json({
            message: "Upload is working! Photos uploaded and saved to MongoDB successfully",
            count: savedFiles.length,
            files: savedFiles
        });
    } catch (error) {
        return res.status(200).json({
            message: "Upload is working! Photos uploaded successfully",
            count: filesDetails.length,
            files: filesDetails,
            dbError: error.message
        });
    }
};

const uploadFieldsPhotoResumeController = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            message: "No files provided for upload"
        });
    }

    const uploadedBy = req.body.uploadedBy ? req.body.uploadedBy.toLowerCase().trim() : "Guest";
    const toSave = [];

    if (req.files.photo && req.files.photo.length > 0) {
        toSave.push(formatFileDetails(req.files.photo[0], uploadedBy));
    }
    if (req.files.resume && req.files.resume.length > 0) {
        toSave.push(formatFileDetails(req.files.resume[0], uploadedBy));
    }

    try {
        const savedFiles = await Upload.insertMany(toSave);
        return res.status(200).json({
            message: "Upload is working! Files uploaded and saved to MongoDB successfully",
            files: savedFiles
        });
    } catch (error) {
        return res.status(200).json({
            message: "Upload is working! Files uploaded successfully",
            files: toSave,
            dbError: error.message
        });
    }
};

module.exports = {
    checkUploadStatus,
    getUploadedFilesController,
    uploadSinglePhotoController,
    uploadArrayPhotosController,
    uploadFieldsPhotoResumeController
};
