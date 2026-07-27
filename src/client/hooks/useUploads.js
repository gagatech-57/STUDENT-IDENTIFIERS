import { useState, useEffect, useCallback } from 'react';
import { fetchUserUploads, uploadSingleFile, deleteUserUpload } from '../services/api';

export function useUploads(userEmail) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [uploadError, setUploadError] = useState('');

  const loadFiles = useCallback(async () => {
    if (!userEmail) return;
    setIsLoadingFiles(true);
    try {
      const userFiles = await fetchUserUploads(userEmail);
      setFiles(userFiles);
    } catch (err) {
      console.error('Failed to load user uploads:', err);
    } finally {
      setIsLoadingFiles(false);
    }
  }, [userEmail]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const upload = useCallback(async (selectedFile) => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadMsg('');
    setUploadError('');

    try {
      const data = await uploadSingleFile(selectedFile, userEmail);
      setUploadMsg('Photo uploaded successfully!');
      await loadFiles();
      return data;
    } catch (err) {
      setUploadError(err.message || 'File upload failed');
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [userEmail, loadFiles]);

  const deleteFile = useCallback(async (fileId) => {
    setUploadMsg('');
    setUploadError('');
    try {
      const data = await deleteUserUpload(fileId);
      setUploadMsg(data.message || 'File deleted successfully!');
      await loadFiles();
      return data;
    } catch (err) {
      setUploadError(err.message || 'File deletion failed');
      throw err;
    }
  }, [loadFiles]);

  return {
    files,
    isUploading,
    isLoadingFiles,
    uploadMsg,
    uploadError,
    setUploadMsg,
    setUploadError,
    upload,
    deleteFile,
    reloadFiles: loadFiles
  };
}
