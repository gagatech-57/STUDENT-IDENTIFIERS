import React, { useState } from 'react';
import { api } from '../services/api';

export function BulkImportModal({ onClose, onSuccess }) {
  const [csvText, setCsvText] = useState(
    'Name,Age,Department,Email,Password\nALEX R,21,CSE,alex.cse@gmail.com,pass1234\nSOPHIA M,22,ECE,sophia.ece@gmail.com,pass1234'
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvText(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) {
      setErrorMsg('CSV contains no data rows to import.');
      return;
    }

    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    // Header row skip
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < 5) continue;

      const [name, age, department, email, password] = cols;

      try {
        await api.post('/register', {
          name,
          age: Number(age),
          department,
          email,
          password
        });
        successCount++;
      } catch (err) {
        console.warn(`Bulk import error for ${email}:`, err.message);
        failCount++;
      }
    }

    setLoading(false);
    onSuccess(`Import complete! Registered ${successCount} new students (${failCount} skipped/duplicates).`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content bulk-import-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="gallery-badge">
            <i className="fa-solid fa-file-import"></i> Admin Bulk Registration
          </span>
          <h2>Bulk Student CSV Import</h2>
          <button type="button" className="close-modal-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleImport} className="modal-body bulk-import-form">
          {errorMsg && (
            <div className="upload-status-alert error">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="csv-file-picker">
            <label htmlFor="csvFileInput" className="csv-file-label">
              <i className="fa-solid fa-upload"></i> Upload CSV File
            </label>
            <input
              id="csvFileInput"
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <span>Or edit the raw CSV text below:</span>
          </div>

          <div className="input-box text-area-box">
            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Name,Age,Department,Email,Password..."
              className="pro-textarea"
              required
            />
          </div>

          <div className="csv-format-hint">
            <i className="fa-solid fa-info-circle"></i>
            Format: <code>Name, Age, Department, Email, Password</code>
          </div>

          <div className="modal-footer-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Importing Students...' : 'Execute Bulk Import'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
