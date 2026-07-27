const express = require("express");
const router = express.Router();
const {
    uploadSinglePhoto,
    uploadArrayPhotos,
    uploadFieldsPhotoResume
} = require("../middleware/uploadMiddleware");
const {
    checkUploadStatus,
    getDbStatusController,
    syncDatabasesController,
    getUploadedFilesController,
    uploadSinglePhotoController,
    uploadArrayPhotosController,
    uploadFieldsPhotoResumeController
} = require("../controllers/uploadController");

// Test Upload Status (GET /upload or GET /upload/test)
router.get("/", checkUploadStatus);
router.get("/test", checkUploadStatus);

// Database Health & Sync Status (GET /upload/db-status & POST /upload/sync)
router.get("/db-status", getDbStatusController);
router.post("/sync", syncDatabasesController);

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
