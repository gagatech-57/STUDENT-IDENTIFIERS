import React, { useState, useMemo } from 'react';
import { useUploads } from '../hooks/useUploads';
import { Dropzone } from '../components/Dropzone';
import { FileCard } from '../components/FileCard';
import { Toast } from '../components/Toast';
import { StudentIdCardModal } from '../components/StudentIdCardModal';
import { ChangePasswordModal } from '../components/ChangePasswordModal';

function InfoTile({ icon, label, value }) {
  return (
    <div className="info-tile">
      <i className={icon}></i>
      <strong>{label}</strong>
      <span title={value}>{value || 'N/A'}</span>
    </div>
  );
}

export function DashboardPage({ student, onLogout }) {
  const [fileToUpload, setFileToUpload] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL', 'IMAGES', 'DOCS'
  const [showIdCard, setShowIdCard] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [toast, setToast] = useState(null);

  const uploadsState = useUploads(student.email);

  const {
    files,
    isUploading,
    isLoadingFiles,
    uploadMsg,
    uploadError,
    upload,
    deleteFile
  } = uploadsState;

  const showToast = (message, title = 'Notification', type = 'success', icon = 'fa-solid fa-circle-check') => {
    setToast({ message, title, type, icon, duration: 3000 });
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!fileToUpload) return;
    try {
      await upload(fileToUpload);
      setFileToUpload(null);
      showToast('File uploaded successfully to Dual Vault!', 'Upload Complete', 'success', 'fa-solid fa-cloud-arrow-up');
    } catch (e) {
      showToast(e.message || 'Upload failed', 'Upload Error', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFile(id);
      showToast('File removed from your vault.', 'Deleted', 'success', 'fa-solid fa-trash-can');
    } catch (err) {
      showToast(err.message || 'Failed to delete file', 'Error', 'error');
    }
  };

  // Filter files by category (Images vs Documents)
  const filteredFiles = useMemo(() => {
    if (categoryFilter === 'ALL') return files;
    return files.filter(f => {
      const isImg = (f.mimeType && f.mimeType.startsWith('image/')) || (f.dataUrl && f.dataUrl.startsWith('data:image'));
      if (categoryFilter === 'IMAGES') return isImg;
      if (categoryFilter === 'DOCS') return !isImg;
      return true;
    });
  }, [files, categoryFilter]);

  const alertMsg = uploadMsg || uploadError;
  const isSuccess = !!uploadMsg;

  return (
    <section className="profile-box">
      <header className="profile-header">
        <div className="header-title-block">
          <span className="profile-kicker">
            <i className="fa-solid fa-graduation-cap"></i> STUDENT IDENTIFIERS
          </span>
          <h1>Profile Dashboard</h1>
        </div>
        <div className="header-actions">
          <div className="status-pill">Active Student</div>
          <button type="button" className="action-header-btn" onClick={() => setShowIdCard(true)}>
            <i className="fa-solid fa-id-card"></i> Digital ID Card
          </button>
          <button type="button" className="action-header-btn" onClick={() => setShowPasswordModal(true)}>
            <i className="fa-solid fa-key"></i> Password
          </button>
          <button type="button" id="topLogoutBtn" onClick={onLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </header>

      <div className="profile-panel">
        <div className="profile-hero">
          <div className="student-avatar">
            <i className="fa-solid fa-user-graduate"></i>
          </div>
          <div className="student-summary">
            <span className="student-id">ID #{student.studentId || 'STD-8890'}</span>
            <h2>{student.name}</h2>
            <p>{student.email}</p>
          </div>
        </div>

        <div className="detail-grid">
          <InfoTile icon="fa-solid fa-id-card" label="Student ID" value={student.studentId} />
          <InfoTile icon="fa-solid fa-building-columns" label="Department" value={student.department} />
          <InfoTile icon="fa-solid fa-calendar" label="Age" value={student.age} />
          <InfoTile icon="fa-solid fa-envelope" label="Email" value={student.email} />
        </div>

        <div className="upload-box">
          <div className="upload-header">
            <h3><i className="fa-solid fa-cloud-arrow-up"></i> File & Image Upload</h3>
          </div>

          <Dropzone
            file={fileToUpload}
            setFile={setFileToUpload}
            onUploadSubmit={handleUploadSubmit}
            isUploading={isUploading}
          />

          {alertMsg && (
            <div className={`upload-status-alert ${isSuccess ? 'success' : 'error'}`}>
              <i className={isSuccess ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}></i>
              <span>{alertMsg}</span>
            </div>
          )}

          <div className="stored-files-section">
            <div className="stored-files-header">
              <h4><i className="fa-solid fa-images"></i> My Uploaded Files ({files.length})</h4>

              <div className="category-filter-group">
                <button
                  type="button"
                  className={`cat-chip ${categoryFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('ALL')}
                >
                  All ({files.length})
                </button>
                <button
                  type="button"
                  className={`cat-chip ${categoryFilter === 'IMAGES' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('IMAGES')}
                >
                  Photos
                </button>
                <button
                  type="button"
                  className={`cat-chip ${categoryFilter === 'DOCS' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('DOCS')}
                >
                  Docs
                </button>
              </div>
            </div>

            {isLoadingFiles ? (
              <div className="skeleton-grid">
                {[1, 2, 3].map(n => (
                  <div key={n} className="skeleton-card">
                    <div className="skeleton-line circle"></div>
                    <div className="skeleton-block">
                      <div className="skeleton-line short"></div>
                      <div className="skeleton-line title"></div>
                      <div className="skeleton-line medium"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredFiles.length > 0 ? (
              <div className="admin-gallery-grid">
                {filteredFiles.map((item, index) => (
                  <FileCard
                    key={item._id || index}
                    item={item}
                    onDelete={(id) => handleDelete(id)}
                    onPreview={(src) => setSelectedImage(src)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-files-box">
                <i className="fa-regular fa-folder-open empty-icon"></i>
                <p>No files match your current category filter.</p>
                <span>Upload a file above to add to your student vault!</span>
              </div>
            )}
          </div>
        </div>

        <footer className="profile-footer">
          <div className="barcode"></div>
          <span className="profile-code">OFFICIAL STUDENT RECORD • MONGO DB ENGINE</span>
        </footer>
      </div>

      {/* Student Lightbox Image Preview Modal */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="lightbox-close" onClick={() => setSelectedImage(null)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <img src={selectedImage} alt="Expanded student preview" />
          </div>
        </div>
      )}

      {/* Printable Digital Student ID Card Modal */}
      {showIdCard && (
        <StudentIdCardModal
          student={student}
          onClose={() => setShowIdCard(false)}
        />
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal
          email={student.email}
          onClose={() => setShowPasswordModal(false)}
          onSuccess={(msg) => showToast(msg, 'Security Update', 'success', 'fa-solid fa-lock')}
        />
      )}

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </section>
  );
}
