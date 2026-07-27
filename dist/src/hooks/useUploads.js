/**
 * Custom hook for File Uploads and File List State Management
 */

import { fetchUserUploads, uploadSingleFile } from "../services/api.js";

const ReactObj = typeof React !== "undefined" ? React : (window.React || {});
const { useState, useEffect, useCallback } = ReactObj;

export function useUploads(userEmail) {
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoadingFiles, setIsLoadingFiles] = useState(false);
    const [uploadMsg, setUploadMsg] = useState("");
    const [uploadError, setUploadError] = useState("");

    const loadFiles = useCallback(async () => {
        if (!userEmail) return;
        setIsLoadingFiles(true);
        try {
            const userFiles = await fetchUserUploads(userEmail);
            setFiles(userFiles);
        } catch (err) {
            console.error("Failed to load user uploads:", err);
        } finally {
            setIsLoadingFiles(false);
        }
    }, [userEmail]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    const upload = useCallback(async (selectedFile) => {
        if (!selectedFile) {
            setUploadError("Please select a file to upload");
            return;
        }

        setIsUploading(true);
        setUploadMsg("");
        setUploadError("");

        try {
            const data = await uploadSingleFile(selectedFile, userEmail);
            setUploadMsg(data.message || "Upload successful!");
            await loadFiles();
            return data;
        } catch (err) {
            setUploadError(err.message || "File upload failed");
            throw err;
        } finally {
            setIsUploading(false);
        }
    }, [userEmail, loadFiles]);

    return {
        files,
        isUploading,
        isLoadingFiles,
        uploadMsg,
        uploadError,
        setUploadMsg,
        setUploadError,
        upload,
        reloadFiles: loadFiles
    };
}
