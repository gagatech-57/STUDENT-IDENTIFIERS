import React, { useState, useMemo } from 'react';
import { getFileUrl, formatUploadDateTime } from '../services/api';

export function StudentGalleryModal({ student, files, onClose, onDeleteFile }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalCategoryFilter, setModalCategoryFilter] = useState('ALL');

  if (!student) return null;

  const studentFiles = useMemo(() => {
    const raw = files.filter(f => {
      if (!f || !f.uploadedBy) return false;
      return f.uploadedBy.toLowerCase() === student.email.toLowerCase();
    });

    if (modalCategoryFilter === 'ALL') return raw;
    return raw.filter(f => {
      const isImg = (f.mimeType && f.mimeType.startsWith('image/')) || (f.dataUrl && f.dataUrl.startsWith('data:image'));
      if (modalCategoryFilter === 'IMAGES') return isImg;
      if (modalCategoryFilter === 'DOCS') return !isImg;
      return true;
    });
  }, [files, student, modalCategoryFilter]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content gallery-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-info">
            <span className="gallery-badge">
              <i className="fa-solid fa-photo-film"></i> Student Vault Gallery
            </span>
            <h2>{student.name}'s Uploaded Files</h2>
            <p className="modal-sub">
              ID #{student.studentId} • {student.department} • {student.email}
            </p>
          </div>
          <button type="button" className="close-modal-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Controls & Category Filter */}
        <div className="modal-filter-bar">
          <div className="category-filter-group">
            <button
              type="button"
              className={`cat-chip ${modalCategoryFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setModalCategoryFilter('ALL')}
            >
              All Files
            </button>
            <button
              type="button"
              className={`cat-chip ${modalCategoryFilter === 'IMAGES' ? 'active' : ''}`}
              onClick={() => setModalCategoryFilter('IMAGES')}
            >
              Photos
            </button>
            <button
              type="button"
              className={`cat-chip ${modalCategoryFilter === 'DOCS' ? 'active' : ''}`}
              onClick={() => setModalCategoryFilter('DOCS')}
            >
              Documents
            </button>
          </div>
        </div>

        <div className="modal-body">
          {studentFiles.length > 0 ? (
            <div className="admin-gallery-grid">
              {studentFiles.map((file, idx) => {
                const imgSrc = file.dataUrl || getFileUrl(file);
                const isImage = file.mimeType ? file.mimeType.startsWith('image/') : true;

                return (
                  <div key={file._id || idx} className="gallery-card">
                    <div className="gallery-card-preview" onClick={() => isImage && setSelectedImage(imgSrc)}>
                      {isImage ? (
                        <img src={imgSrc} alt={file.originalName || file.filename} loading="lazy" />
                      ) : (
                        <div className="doc-icon-preview">
                          <i className="fa-solid fa-file-lines"></i>
                          <span>{(file.mimeType || 'FILE').toUpperCase()}</span>
                        </div>
                      )}
                      <div className="preview-overlay">
                        <i className="fa-solid fa-magnifying-glass-plus"></i> View
                      </div>
                    </div>

                    <div className="gallery-card-info">
                      <strong title={file.originalName || file.filename}>
                        {file.originalName || file.filename}
                      </strong>
                      <div className="file-meta-row">
                        <span><i className="fa-regular fa-clock"></i> {formatUploadDateTime(file.uploadedAt)}</span>
                        <span><i className="fa-solid fa-hard-drive"></i> {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Vault File'}</span>
                      </div>

                      <div className="gallery-card-actions">
                        <a
                          href={imgSrc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gallery-action-btn view-btn"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square"></i> Open
                        </a>
                        {onDeleteFile && (
                          <button
                            type="button"
                            className="gallery-action-btn delete-btn"
                            onClick={() => onDeleteFile(file._id || file.filename)}
                          >
                            <i className="fa-solid fa-trash-can"></i> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-gallery-state">
              <i className="fa-regular fa-folder-open empty-icon"></i>
              <h3>No Files Found</h3>
              <p>No files matched your selected category filter.</p>
            </div>
          )}
        </div>

        {selectedImage && (
          <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
            <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="lightbox-close" onClick={() => setSelectedImage(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              <img src={selectedImage} alt="Expanded preview" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
