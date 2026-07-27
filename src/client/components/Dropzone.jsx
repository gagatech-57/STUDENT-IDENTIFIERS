import React, { useState, useRef } from 'react';

export function Dropzone({ file, setFile, onUploadSubmit, isUploading }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }

  return (
    <form onSubmit={onUploadSubmit} className="upload-form">
      <div
        className={`dropzone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <input
          type="file"
          id="uploadInput"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <i className={file ? 'fa-solid fa-file-circle-check drop-icon success' : 'fa-solid fa-cloud-arrow-up drop-icon'}></i>
        {file ? (
          <div className="selected-file-info">
            <strong>{file.name}</strong>
            <span>{(file.size / 1024).toFixed(1)} KB • Click to change</span>
          </div>
        ) : (
          <div className="drop-text">
            <strong>Click or drag a file to upload</strong>
            <span>Supports JPG, PNG, WEBP, GIF, PDF, DOCX (Max 10MB)</span>
          </div>
        )}
      </div>

      <button type="submit" className="upload-btn" disabled={isUploading || !file}>
        {isUploading ? (
          <span className="btn-flex"><i className="fa-solid fa-spinner fa-spin"></i> Uploading file...</span>
        ) : (
          <span className="btn-flex"><i className="fa-solid fa-upload"></i> Upload File</span>
        )}
      </button>
    </form>
  );
}
