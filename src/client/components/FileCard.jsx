import React from 'react';
import { getFileUrl, formatUploadDateTime } from '../services/api';

export function FileCard({ item, onDelete }) {
  const isImage = (item.mimeType && item.mimeType.startsWith('image/')) || (item.dataUrl && item.dataUrl.startsWith('data:image'));
  const src = getFileUrl(item);

  return (
    <div className="file-card">
      {isImage ? (
        <div className="file-card-preview">
          <img src={src} alt={item.originalName || 'Uploaded File'} />
        </div>
      ) : (
        <div className="file-card-icon">
          <i className="fa-solid fa-file-lines"></i>
        </div>
      )}
      <div className="file-card-details">
        <div className="file-card-time-badge">
          <i className="fa-regular fa-clock"></i> {formatUploadDateTime(item.uploadedAt)}
        </div>
        <span className="file-card-name" title={item.originalName || item.filename}>
          {item.originalName || item.filename}
        </span>

        <div className="file-card-meta">
          <a href={src} target="_blank" rel="noopener noreferrer" className="view-link">
            <i className="fa-solid fa-arrow-up-right-from-square"></i> Open
          </a>
          {onDelete && (
            <button
              type="button"
              className="delete-card-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this image?')) {
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
