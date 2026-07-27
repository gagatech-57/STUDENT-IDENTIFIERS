import React, { useState } from 'react';
import { useUploads } from '../hooks/useUploads';
import { Dropzone } from '../components/Dropzone';
import { FileCard } from '../components/FileCard';

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
  const uploadsState = useUploads(student.email);

  const {
    files,
    isUploading,
    uploadMsg,
    uploadError,
    upload,
    deleteFile
  } = uploadsState;

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!fileToUpload) return;
    try {
      await upload(fileToUpload);
      setFileToUpload(null);
    } catch (e) {
      // Error handled in hook
    }
  };

  const alertMsg = uploadMsg || uploadError;
  const isSuccess = !!uploadMsg;

  return (
    <section className="profile-box">
      <header className="profile-header">
        <div>
          <span className="profile-kicker">Student Portal</span>
          <h1>Profile Dashboard</h1>
        </div>
        <div className="header-actions">
          <div className="status-pill">Active Student</div>
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
            <h4><i className="fa-solid fa-images"></i> My Uploaded Files ({files.length})</h4>
            {files.length > 0 ? (
              <div className="files-grid">
                {files.map((item, index) => (
                  <FileCard
                    key={item._id || index}
                    item={item}
                    onDelete={(id) => deleteFile(id)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-files-box">
                <i className="fa-regular fa-folder-open empty-icon"></i>
                <p>No files uploaded by {student.email} yet.</p>
                <span>Upload an image above to see it appear here!</span>
              </div>
            )}
          </div>
        </div>

        <footer className="profile-footer">
          <div className="barcode"></div>
          <span className="profile-code">OFFICIAL STUDENT RECORD • MONGO DB ENGINE</span>
        </footer>
      </div>
    </section>
  );
}
