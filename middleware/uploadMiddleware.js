const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Create uploads directory automatically if it does not exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure disk storage using Date.now() for unique filenames
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname || "");
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

// File filter: Allow JPG, JPEG, PNG, PDF, DOCX, or files without strict extension check
const fileFilter = (req, file, cb) => {
    const allowedExts = /\.(jpg|jpeg|png|pdf|docx|webp|gif)$/i;
    const ext = path.extname(file.originalname || "").toLowerCase();
    const isExtAllowed = ext ? allowedExts.test(ext) : true;

    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/pjpeg",
        "image/png",
        "image/x-png",
        "image/webp",
        "image/gif",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "application/octet-stream"
    ];
    const isMimeAllowed = allowedMimeTypes.includes(file.mimetype) || !file.mimetype;

    if (isExtAllowed || isMimeAllowed) {
        return cb(null, true);
    } else {
        const err = new Error("Invalid file type. Only image files (JPG, PNG, WEBP, GIF) and documents (PDF, DOCX) are allowed!");
        err.code = "INVALID_FILE_TYPE";
        return cb(err, false);
    }
};

// Configure Multer instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: fileFilter
});

// Express Error handling helper for Multer
function handleMulterError(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "File size exceeds limit. Maximum allowed size is 10MB"
            });
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                message: "Unexpected field name. Please use field name 'photo' for single file upload"
            });
        }
        return res.status(400).json({
            message: err.message
        });
    } else if (err) {
        return res.status(400).json({
            message: err.message || "File upload failed"
        });
    }
    next();
}

// Wrapper middleware functions to catch all upload errors and prevent hanging
const uploadSinglePhoto = (req, res, next) => {
    upload.single("photo")(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        next();
    });
};

const uploadArrayPhotos = (req, res, next) => {
    upload.array("photos", 5)(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        next();
    });
};

const uploadFieldsPhotoResume = (req, res, next) => {
    upload.fields([
        { name: "photo", maxCount: 1 },
        { name: "resume", maxCount: 1 }
    ])(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        next();
    });
};

module.exports = {
    uploadSinglePhoto,
    uploadArrayPhotos,
    uploadFieldsPhotoResume,
    handleMulterError
};
