const fs = require("fs");
const path = require("path");
const { getModels, getDbStatus } = require("../config/db");

const getLocalFileBase64 = (filename, mimeType) => {
    try {
        const possiblePaths = [
            path.join(__dirname, "../uploads", filename),
            path.join(__dirname, "../public/uploads", filename),
            path.resolve(process.cwd(), "src/uploads", filename),
            path.resolve(process.cwd(), "uploads", filename)
        ];

        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                const buf = fs.readFileSync(p);
                const type = mimeType || "image/jpeg";
                return `data:${type};base64,${buf.toString("base64")}`;
            }
        }
    } catch (e) {
        console.warn(`Base64 conversion failed for ${filename}:`, e.message);
    }
    return null;
};

const formatFileDetails = (file, uploadedBy = "Guest") => {
    let dataUrl = null;

    if (file.path && fs.existsSync(file.path)) {
        try {
            const buf = fs.readFileSync(file.path);
            dataUrl = `data:${file.mimetype};base64,${buf.toString("base64")}`;
        } catch (e) {
            console.warn("Base64 format error:", e.message);
        }
    } else if (file.buffer) {
        dataUrl = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    }

    if (!dataUrl && file.filename) {
        dataUrl = getLocalFileBase64(file.filename, file.mimetype);
    }

    return {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
        dataUrl: dataUrl,
        uploadedBy: uploadedBy,
        uploadedAt: new Date()
    };
};

const saveDualUpload = async (fileDetails) => {
    const { AtlasUpload, LocalUpload } = getModels();
    let savedAtlas = null;
    let savedLocal = null;
    let errors = [];

    if (AtlasUpload) {
        try {
            savedAtlas = await AtlasUpload.create(fileDetails);
        } catch (err) {
            errors.push(`Atlas DB Save Warning: ${err.message}`);
        }
    }

    if (LocalUpload) {
        try {
            const existing = await LocalUpload.findOne({ filename: fileDetails.filename });
            if (!existing) {
                savedLocal = await LocalUpload.create(fileDetails);
            } else {
                savedLocal = existing;
            }
        } catch (err) {
            errors.push(`Local DB Save Warning: ${err.message}`);
        }
    }

    const savedFile = savedAtlas || savedLocal || fileDetails;

    return {
        savedFile,
        savedTo: {
            onlineAtlas: !!savedAtlas,
            localMongo: !!savedLocal
        },
        errors
    };
};

const getUploadedFilesService = async (uploadedByFilter) => {
    const { AtlasUpload, LocalUpload } = getModels();
    const dbStatus = getDbStatus();
    const query = {};

    if (uploadedByFilter) {
        query.uploadedBy = uploadedByFilter.toLowerCase().trim();
    }

    let atlasFiles = [];
    let localFiles = [];

    if (AtlasUpload) {
        try {
            atlasFiles = await AtlasUpload.find(query).sort({ uploadedAt: -1 }).limit(100).lean();
        } catch (e) {
            console.warn("Atlas fetch warning:", e.message);
        }
    }

    if (LocalUpload) {
        try {
            localFiles = await LocalUpload.find(query).sort({ uploadedAt: -1 }).limit(100).lean();
        } catch (e) {
            console.warn("Local fetch warning:", e.message);
        }
    }

    // Merge files from both databases and tag locations
    const fileMap = new Map();

    const processDoc = (f, locationName) => {
        // If doc is missing dataUrl, attempt backfilling from local disk
        if (!f.dataUrl) {
            const base64 = getLocalFileBase64(f.filename, f.mimeType);
            if (base64) {
                f.dataUrl = base64;
                // Backfill to DB in background
                if (AtlasUpload) {
                    AtlasUpload.updateOne({ filename: f.filename }, { $set: { dataUrl: base64 } }).catch(() => {});
                }
                if (LocalUpload) {
                    LocalUpload.updateOne({ filename: f.filename }, { $set: { dataUrl: base64 } }).catch(() => {});
                }
            }
        }

        if (fileMap.has(f.filename)) {
            const existing = fileMap.get(f.filename);
            if (!existing.locations.includes(locationName)) {
                existing.locations.push(locationName);
            }
            if (!existing.dataUrl && f.dataUrl) {
                existing.dataUrl = f.dataUrl;
            }
        } else {
            f.locations = [locationName];
            fileMap.set(f.filename, f);
        }
    };

    atlasFiles.forEach(f => processDoc(f, "Online Atlas"));
    localFiles.forEach(f => processDoc(f, "Local MongoDB"));

    const combinedFiles = Array.from(fileMap.values()).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return {
        message: "Uploaded files fetched successfully",
        dbStatus,
        count: combinedFiles.length,
        files: combinedFiles
    };
};

const saveSinglePhotoService = async (file, rawUploadedBy) => {
    const uploadedBy = rawUploadedBy ? rawUploadedBy.toLowerCase().trim() : "Guest";
    const fileData = formatFileDetails(file, uploadedBy);
    const result = await saveDualUpload(fileData);

    return {
        message: "Photo uploaded successfully!",
        file: result.savedFile,
        savedTo: result.savedTo,
        dbErrors: result.errors
    };
};

const saveArrayPhotosService = async (files, rawUploadedBy) => {
    const uploadedBy = rawUploadedBy ? rawUploadedBy.toLowerCase().trim() : "Guest";
    const filesDetails = files.map(f => formatFileDetails(f, uploadedBy));

    const savedResults = [];
    for (const fDetail of filesDetails) {
        const res = await saveDualUpload(fDetail);
        savedResults.push(res.savedFile);
    }

    return {
        message: "Photos uploaded successfully!",
        count: savedResults.length,
        files: savedResults
    };
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

    const savedResults = [];
    for (const fDetail of toSave) {
        const res = await saveDualUpload(fDetail);
        savedResults.push(res.savedFile);
    }

    return {
        message: "Files uploaded successfully!",
        files: savedResults
    };
};

const syncUploadsService = async () => {
    const { AtlasUpload, LocalUpload } = getModels();

    if (!AtlasUpload || !LocalUpload) {
        return {
            success: false,
            message: "Cannot sync uploads: one or both databases are disconnected.",
            dbStatus: getDbStatus()
        };
    }

    const atlasFiles = await AtlasUpload.find().lean();
    const localFiles = await LocalUpload.find().lean();

    const localFilenames = new Set(localFiles.map(f => f.filename));
    const atlasFilenames = new Set(atlasFiles.map(f => f.filename));

    let syncedToLocal = 0;
    let syncedToAtlas = 0;

    // Sync Atlas -> Local
    for (const f of atlasFiles) {
        if (!f.dataUrl) {
            f.dataUrl = getLocalFileBase64(f.filename, f.mimeType);
        }
        if (!localFilenames.has(f.filename)) {
            const cleanDoc = { ...f };
            delete cleanDoc._id;
            delete cleanDoc.__v;
            await LocalUpload.create(cleanDoc);
            syncedToLocal++;
        } else {
            if (f.dataUrl) {
                await LocalUpload.updateOne({ filename: f.filename }, { $set: { dataUrl: f.dataUrl } }).catch(() => {});
            }
        }
    }

    // Sync Local -> Atlas
    for (const f of localFiles) {
        if (!f.dataUrl) {
            f.dataUrl = getLocalFileBase64(f.filename, f.mimeType);
        }
        if (!atlasFilenames.has(f.filename)) {
            const cleanDoc = { ...f };
            delete cleanDoc._id;
            delete cleanDoc.__v;
            await AtlasUpload.create(cleanDoc);
            syncedToAtlas++;
        } else {
            if (f.dataUrl) {
                await AtlasUpload.updateOne({ filename: f.filename }, { $set: { dataUrl: f.dataUrl } }).catch(() => {});
            }
        }
    }

    return {
        success: true,
        message: `Uploads sync complete! Synced ${syncedToLocal} files to Local DB and ${syncedToAtlas} files to Online Atlas.`,
        syncedToLocal,
        syncedToAtlas
    };
};

module.exports = {
    formatFileDetails,
    getUploadedFilesService,
    saveSinglePhotoService,
    saveArrayPhotosService,
    saveFieldsPhotoResumeService,
    syncUploadsService
};
