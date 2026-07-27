const { getModels, getDbStatus } = require("../config/db");

const formatFileDetails = (file, uploadedBy = "Guest") => ({
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    url: `/uploads/${file.filename}`,
    uploadedBy: uploadedBy,
    uploadedAt: new Date()
});

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

    atlasFiles.forEach(f => {
        f.locations = ["Online Atlas"];
        fileMap.set(f.filename, f);
    });

    localFiles.forEach(f => {
        if (fileMap.has(f.filename)) {
            const existing = fileMap.get(f.filename);
            if (!existing.locations.includes("Local MongoDB")) {
                existing.locations.push("Local MongoDB");
            }
        } else {
            f.locations = ["Local MongoDB"];
            fileMap.set(f.filename, f);
        }
    });

    const combinedFiles = Array.from(fileMap.values()).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return {
        message: "Uploaded files fetched successfully from Dual MongoDB (Atlas + Local)",
        dbStatus,
        count: combinedFiles.length,
        files: combinedFiles
    };
};

const saveSinglePhotoService = async (file, rawUploadedBy) => {
    const uploadedBy = rawUploadedBy ? rawUploadedBy.toLowerCase().trim() : "Guest";
    const fileData = formatFileDetails(file, uploadedBy);
    const result = await saveDualUpload(fileData);

    let msg = "Photo uploaded successfully!";
    if (result.savedTo.onlineAtlas && result.savedTo.localMongo) {
        msg = "Photo uploaded and saved to BOTH Online Atlas & Local MongoDB successfully!";
    } else if (result.savedTo.onlineAtlas) {
        msg = "Photo uploaded and saved to Online Atlas MongoDB!";
    } else if (result.savedTo.localMongo) {
        msg = "Photo uploaded and saved to Local MongoDB!";
    }

    return {
        message: msg,
        file: result.savedFile,
        savedTo: result.savedTo,
        dbErrors: result.errors
    };
};

const saveArrayPhotosService = async (files, rawUploadedBy) => {
    const uploadedBy = rawUploadedBy ? rawUploadedBy.toLowerCase().trim() : "Guest";
    const filesDetails = files.map(f => formatFileDetails(f, uploadedBy));

    const savedResults = [];
    let savedAtlasCount = 0;
    let savedLocalCount = 0;

    for (const fDetail of filesDetails) {
        const res = await saveDualUpload(fDetail);
        savedResults.push(res.savedFile);
        if (res.savedTo.onlineAtlas) savedAtlasCount++;
        if (res.savedTo.localMongo) savedLocalCount++;
    }

    return {
        message: `Photos uploaded and saved! (Atlas: ${savedAtlasCount}/${files.length}, Local: ${savedLocalCount}/${files.length})`,
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
        message: "Files uploaded and saved to Dual MongoDB successfully!",
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
        if (!localFilenames.has(f.filename)) {
            const cleanDoc = { ...f };
            delete cleanDoc._id;
            delete cleanDoc.__v;
            await LocalUpload.create(cleanDoc);
            syncedToLocal++;
        }
    }

    // Sync Local -> Atlas
    for (const f of localFiles) {
        if (!atlasFilenames.has(f.filename)) {
            const cleanDoc = { ...f };
            delete cleanDoc._id;
            delete cleanDoc.__v;
            await AtlasUpload.create(cleanDoc);
            syncedToAtlas++;
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
