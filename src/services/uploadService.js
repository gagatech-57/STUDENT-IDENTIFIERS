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

const getUploadedFilesService = async (uploadedByFilter) => {
    const query = {};
    if (uploadedByFilter) {
        query.uploadedBy = uploadedByFilter.toLowerCase().trim();
    }

    const files = await Upload.find(query).sort({ uploadedAt: -1 }).limit(50);
    return {
        message: "Uploaded files fetched successfully from MongoDB",
        count: files.length,
        files: files
    };
};

const saveSinglePhotoService = async (file, rawUploadedBy) => {
    const uploadedBy = rawUploadedBy ? rawUploadedBy.toLowerCase().trim() : "Guest";
    const fileData = formatFileDetails(file, uploadedBy);

    try {
        const savedFile = await Upload.create(fileData);
        return {
            message: "Upload is working! Photo uploaded and saved to MongoDB successfully",
            file: savedFile
        };
    } catch (error) {
        return {
            message: "Upload is working! Photo uploaded successfully",
            file: fileData,
            dbError: error.message
        };
    }
};

const saveArrayPhotosService = async (files, rawUploadedBy) => {
    const uploadedBy = rawUploadedBy ? rawUploadedBy.toLowerCase().trim() : "Guest";
    const filesDetails = files.map(f => formatFileDetails(f, uploadedBy));

    try {
        const savedFiles = await Upload.insertMany(filesDetails);
        return {
            message: "Upload is working! Photos uploaded and saved to MongoDB successfully",
            count: savedFiles.length,
            files: savedFiles
        };
    } catch (error) {
        return {
            message: "Upload is working! Photos uploaded successfully",
            count: filesDetails.length,
            files: filesDetails,
            dbError: error.message
        };
    }
};

const saveFieldsPhotoResumeService = async (files, rawUploadedBy) => {
    const uploadedBy = rawUploadedBy ? rawUploadedBy.toLowerCase().trim() : "Guest";
    const toSave = [];

    if (files.photo && files.photo.length > 0) {
        toSave.push(formatFileDetails(files.photo[0], uploadedBy));
    }
    if (files.resume && files.resume.length > 0) {
        toSave.push(formatFileDetails(files.resume[0], uploadedBy));
    }

    try {
        const savedFiles = await Upload.insertMany(toSave);
        return {
            message: "Upload is working! Files uploaded and saved to MongoDB successfully",
            files: savedFiles
        };
    } catch (error) {
        return {
            message: "Upload is working! Files uploaded successfully",
            files: toSave,
            dbError: error.message
        };
    }
};

module.exports = {
    formatFileDetails,
    getUploadedFilesService,
    saveSinglePhotoService,
    saveArrayPhotosService,
    saveFieldsPhotoResumeService
};
