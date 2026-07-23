const express = require("express");
const router = express.Router();
const {
    uploadSinglePhoto,
    uploadArrayPhotos,
    uploadFieldsPhotoResume
} = require("../middleware/uploadMiddleware");
const {
    checkUploadStatus,
    getUploadedFilesController,
    uploadSinglePhotoController,
    uploadArrayPhotosController,
    uploadFieldsPhotoResumeController
} = require("../controllers/uploadController");

// Test Upload Status (GET /upload or GET /upload/test)
router.get("/", checkUploadStatus);
router.get("/test", checkUploadStatus);

// Get Uploaded Files from MongoDB (GET /upload/files)
router.get("/files", getUploadedFilesController);

// Upload Single Photo (POST /upload or POST /upload/single)
router.post("/", uploadSinglePhoto, uploadSinglePhotoController);
router.post("/single", uploadSinglePhoto, uploadSinglePhotoController);

// Upload Multiple Photos (POST /upload/array)
router.post("/array", uploadArrayPhotos, uploadArrayPhotosController);

// Upload Photo and Resume (POST /upload/fields)
router.post("/fields", uploadFieldsPhotoResume, uploadFieldsPhotoResumeController);

module.exports = router;