import React from 'react';

export function StudentIdCardModal({ student, onClose }) {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content id-card-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="gallery-badge">
            <i className="fa-solid fa-id-card"></i> Official Student Identifiers Credential
          </span>
          <button type="button" className="close-modal-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="modal-body id-card-modal-body">
          {/* Printable Student ID Card Container */}
          <div className="student-id-card-printable" id="printableStudentCard">
            <div className="id-card-top-banner">
              <div className="id-card-logo">
                <i className="fa-solid fa-building-columns"></i>
              </div>
              <div className="id-card-institution">
                <h3>STUDENT IDENTIFIERS</h3>
                <span>OFFICIAL DIGITAL CREDENTIAL • MONGO DB ENGINE</span>
              </div>
              <div className="id-card-chip">
                <i className="fa-solid fa-microchip"></i>
              </div>
            </div>

            <div className="id-card-main-body">
              <div className="id-card-avatar-box">
                <i className="fa-solid fa-user-graduate"></i>
              </div>

              <div className="id-card-details">
                <div className="id-card-name-title">
                  <h2>{student.name || 'STUDENT NAME'}</h2>
                  <span className="id-card-dept-badge">{student.department || 'GENERAL'}</span>
                </div>

                <div className="id-card-fields-grid">
                  <div className="id-field">
                    <span>STUDENT ID</span>
                    <strong>#{student.studentId || 'STD-000'}</strong>
                  </div>

                  <div className="id-field">
                    <span>AGE</span>
                    <strong>{student.age || 'N/A'} YRS</strong>
                  </div>

                  <div className="id-field full-width">
                    <span>EMAIL ADDRESS</span>
                    <strong>{student.email || 'N/A'}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="id-card-footer">
              <div className="id-barcode-box">
                <div className="barcode-bars"></div>
                <span>*{student.studentId}*</span>
              </div>

              <div className="id-card-seal">
                <i className="fa-solid fa-award"></i>
                <span>VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
