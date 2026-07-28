import React from 'react';
import { getFileUrl, formatUploadDateTime } from '../services/api';

export function FileCard({ item, onDelete, onPreview }) {
  const src = item.dataUrl || getFileUrl(item);
  const isImage = (item.mimeType && item.mimeType.startsWith('image/')) || (item.dataUrl && item.dataUrl.startsWith('data:image')) || true;

  const fileSizeStr = item.size ? `${(item.size / 1024).toFixed(1)} KB` : 'Vault File';

  return (
    <div className="gallery-card student-file-card">
      <div className="gallery-card-preview" onClick={() => isImage && onPreview && onPreview(src)}>
        {isImage ? (
          <img src={src} alt={item.originalName || item.filename || 'Uploaded File'} />
        ) : (
          <div className="doc-icon-preview">
            <i className="fa-solid fa-file-lines"></i>
            <span>{(item.mimeType || 'FILE').toUpperCase()}</span>
          </div>
        )}
        <div className="preview-overlay">
          <i className="fa-solid fa-magnifying-glass-plus"></i> View
        </div>
      </div>

      <div className="gallery-card-info">
        <strong title={item.originalName || item.filename}>
          {item.originalName || item.filename}
        </strong>

        <div className="file-meta-row">
          <span><i className="fa-regular fa-clock"></i> {formatUploadDateTime(item.uploadedAt)}</span>
          <span><i className="fa-solid fa-hard-drive"></i> {fileSizeStr}</span>
        </div>

        <div className="gallery-card-actions">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="gallery-action-btn view-btn"
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i> Open
          </a>
          {onDelete && (
            <button
              type="button"
              className="gallery-action-btn delete-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this file?')) {
                  onDelete(item._id || item.filename);
                }
              }}
              title="Delete this file"
            >
              <i className="fa-solid fa-trash-can"></i> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
