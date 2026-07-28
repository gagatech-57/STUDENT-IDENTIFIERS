import React, { useState, useEffect, useMemo } from 'react';
import { api, deleteUserUpload } from '../services/api';
import { StudentGalleryModal } from '../components/StudentGalleryModal';
import { StudentIdCardModal } from '../components/StudentIdCardModal';
import { BulkImportModal } from '../components/BulkImportModal';
import { Toast } from '../components/Toast';

export function AdminDashboardPage({ admin, onLogout }) {
  const [students, setStudents] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [sortBy, setSortBy] = useState('id'); // 'id', 'name', 'department', 'files', 'age'
  const [selectedStudentForGallery, setSelectedStudentForGallery] = useState(null);
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState(null);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [activeTab, setActiveTab] = useState('students'); // 'students' or 'audit'
  const [auditLogs, setAuditLogs] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, title = 'Notification', type = 'success', icon = 'fa-solid fa-circle-check') => {
    setToast({ message, title, type, icon, duration: 3000 });
  };

  const addAuditLog = (action, details) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [studentsRes, filesRes] = await Promise.all([
        api.get('/students', { headers }),
        api.get('/upload/files', { headers })
      ]);
      const fetchedStudents = studentsRes.data || [];
      const fetchedFiles = filesRes.data?.files || [];

      setStudents(fetchedStudents);
      setFiles(fetchedFiles);

      addAuditLog('SYSTEM FETCH', `Loaded ${fetchedStudents.length} students & ${fetchedFiles.length} files from Dual MongoDB.`);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      showToast('Failed to fetch records from database', 'Error', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file from the vault?')) return;
    try {
      await deleteUserUpload(fileId);
      setFiles(prev => prev.filter(f => f._id !== fileId && f.filename !== fileId));
      addAuditLog('FILE DELETION', `File ${fileId} deleted from vault.`);
      showToast('File deleted successfully!', 'Vault Action', 'success', 'fa-solid fa-trash-can');
    } catch (err) {
      showToast(err.message || 'Failed to delete file', 'Error', 'error');
    }
  };

  // Compute student upload counts
  const studentFileCounts = useMemo(() => {
    const counts = {};
    files.forEach(f => {
      if (f.uploadedBy) {
        const email = f.uploadedBy.toLowerCase();
        counts[email] = (counts[email] || 0) + 1;
      }
    });
    return counts;
  }, [files]);

  // Group and sort students department-wise
  const departmentGrouped = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // 1. Filter students
    let filtered = students.filter(s => {
      const matchSearch = !q || (
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.studentId && s.studentId.toString().includes(q)) ||
        (s.department && s.department.toLowerCase().includes(q))
      );
      const matchDept = selectedDepartment === 'ALL' || (s.department && s.department.toUpperCase() === selectedDepartment);
      return matchSearch && matchDept;
    });

    // 2. Sort students
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'department') return (a.department || '').localeCompare(b.department || '');
      if (sortBy === 'age') return (Number(a.age) || 0) - (Number(b.age) || 0);
      if (sortBy === 'files') {
        const cntA = studentFileCounts[(a.email || '').toLowerCase()] || 0;
        const cntB = studentFileCounts[(b.email || '').toLowerCase()] || 0;
        return cntB - cntA;
      }
      return (a.studentId || '').localeCompare(b.studentId || '', undefined, { numeric: true });
    });

    // 3. Group by department
    const groups = {};
    filtered.forEach(s => {
      const dept = (s.department || 'GENERAL').toUpperCase();
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(s);
    });

    return groups;
  }, [students, searchQuery, selectedDepartment, sortBy, studentFileCounts]);

  const departmentList = useMemo(() => {
    const set = new Set(students.map(s => (s.department || 'GENERAL').toUpperCase()));
    return ['ALL', ...Array.from(set).sort()];
  }, [students]);

  // Export to CSV Function
  const exportToCSV = () => {
    if (students.length === 0) {
      showToast('No student data available to export.', 'Export Notice', 'error');
      return;
    }
    const headers = ['Student ID', 'Full Name', 'Department', 'Age', 'Email', 'Vault Files Count'];
    const rows = students.map(s => [
      `"${s.studentId || ''}"`,
      `"${s.name || ''}"`,
      `"${s.department || ''}"`,
      `"${s.age || ''}"`,
      `"${s.email || ''}"`,
      `"${studentFileCounts[(s.email || '').toLowerCase()] || 0}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_identifiers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('CSV EXPORT', `Exported ${students.length} student records to CSV.`);
    showToast(`Successfully exported ${students.length} student records to CSV!`, 'Export Complete', 'success', 'fa-solid fa-file-csv');
  };

  // Export to JSON Function
  const exportToJSON = () => {
    if (students.length === 0) {
      showToast('No student data available to export.', 'Export Notice', 'error');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `student_identifiers_export_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
    addAuditLog('JSON EXPORT', `Exported ${students.length} student records to JSON.`);
    showToast(`Successfully exported ${students.length} student records to JSON!`, 'Export Complete', 'success', 'fa-solid fa-file-code');
  };

  // Copy to Clipboard helper
  const copyToClipboard = (text, label = 'Text') => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, 'Copied', 'success', 'fa-regular fa-copy');
  };

  return (
    <section className="profile-box admin-box">
      <header className="profile-header admin-header">
        <div className="header-title-block">
          <span className="profile-kicker admin-kicker">
            <i className="fa-solid fa-user-shield"></i> STUDENT IDENTIFIERS ADMIN
          </span>
          <h1>System Control & Department Vault</h1>
        </div>
        <div className="header-actions">
          <div className="status-pill admin-pill">
            <i className="fa-solid fa-user-gear"></i> System Admin ({admin.email})
          </div>
          <button type="button" id="topLogoutBtn" onClick={onLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </header>

      <div className="profile-panel admin-panel">
        {/* Statistics Bar */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><i className="fa-solid fa-users-viewfinder"></i></div>
            <div className="stat-info">
              <span className="stat-value">{students.length}</span>
              <span className="stat-label">Total Registered Students</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon cyan"><i className="fa-solid fa-building-columns"></i></div>
            <div className="stat-info">
              <span className="stat-value">{departmentList.length > 1 ? departmentList.length - 1 : 0}</span>
              <span className="stat-label">Active Departments</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple"><i className="fa-solid fa-photo-film"></i></div>
            <div className="stat-info">
              <span className="stat-value">{files.length}</span>
              <span className="stat-label">Total Vault Files Uploaded</span>
            </div>
          </div>
        </div>

        {/* View Mode Tabs: Students View vs Audit Trail */}
        <div className="view-tab-row">
          <button
            type="button"
            className={`view-tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <i className="fa-solid fa-users"></i> Students Directory
          </button>
          <button
            type="button"
            className={`view-tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <i className="fa-solid fa-clock-rotate-left"></i> System Audit Logs ({auditLogs.length})
          </button>
        </div>

        {activeTab === 'students' ? (
          <>
            {/* Export & Tools Bar */}
            <div className="admin-tools-header">
              <div className="export-btn-group">
                <button type="button" className="export-btn csv-btn" onClick={exportToCSV} title="Export Database to CSV">
                  <i className="fa-solid fa-file-csv"></i> Export CSV
                </button>
                <button type="button" className="export-btn json-btn" onClick={exportToJSON} title="Export Database to JSON">
                  <i className="fa-solid fa-file-code"></i> Export JSON
                </button>
                <button
                  type="button"
                  className="export-btn import-btn"
                  onClick={() => setShowBulkImportModal(true)}
                  title="Bulk Import Students from CSV"
                >
                  <i className="fa-solid fa-file-import"></i> Bulk Import CSV
                </button>
              </div>

              <div className="sort-selector-wrapper">
                <label htmlFor="sortSelect"><i className="fa-solid fa-arrow-down-wide-short"></i> Sort By:</label>
                <select
                  id="sortSelect"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pro-select"
                >
                  <option value="id">Student ID</option>
                  <option value="name">Name (A - Z)</option>
                  <option value="department">Department</option>
                  <option value="files">Most Vault Files</option>
                  <option value="age">Age</option>
                </select>
              </div>
            </div>

            {/* Controls Bar: Search & Department Tabs */}
            <div className="admin-controls-bar">
              <div className="admin-search-wrapper">
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                <input
                  type="text"
                  placeholder="Search student by name, email, ID or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-search-input"
                />
                {searchQuery && (
                  <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              <div className="dept-filter-scroll">
                {departmentList.map(dept => (
                  <button
                    key={dept}
                    type="button"
                    className={`dept-chip ${selectedDepartment === dept ? 'active' : ''}`}
                    onClick={() => setSelectedDepartment(dept)}
                  >
                    {dept === 'ALL' ? 'All Departments' : dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Skeleton Shimmer Loader or Real Data Grid */}
            {loading ? (
              <div className="skeleton-grid">
                {[1, 2, 3, 4, 5, 6].map(n => (
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
            ) : (
              <div className="departments-container">
                {Object.keys(departmentGrouped).length > 0 ? (
                  Object.entries(departmentGrouped).map(([deptName, deptStudents]) => (
                    <div key={deptName} className="department-section">
                      <div className="department-header">
                        <div className="dept-title-group">
                          <i className="fa-solid fa-folder-closed dept-icon"></i>
                          <h3>{deptName}</h3>
                          <span className="student-count-badge">
                            {deptStudents.length} {deptStudents.length === 1 ? 'Student' : 'Students'}
                          </span>
                        </div>
                      </div>

                      <div className="student-cards-grid">
                        {deptStudents.map(student => {
                          const fileCount = studentFileCounts[(student.email || '').toLowerCase()] || 0;
                          return (
                            <div key={student.studentId || student._id} className="student-admin-card">
                              <div className="student-card-top">
                                <div className="student-avatar-circle">
                                  <i className="fa-solid fa-graduation-cap"></i>
                                </div>
                                <div className="student-meta-main">
                                  <div className="id-copy-row">
                                    <span className="id-chip">ID #{student.studentId}</span>
                                    <button
                                      type="button"
                                      className="mini-copy-btn"
                                      onClick={() => copyToClipboard(student.email, 'Email')}
                                      title="Copy Email"
                                    >
                                      <i className="fa-regular fa-copy"></i>
                                    </button>
                                  </div>
                                  <h4>{student.name}</h4>
                                  <p className="student-email">{student.email}</p>
                                </div>
                              </div>

                              <div className="student-card-details">
                                <div className="mini-detail">
                                  <span>Department:</span>
                                  <strong>{student.department}</strong>
                                </div>
                                <div className="mini-detail">
                                  <span>Age:</span>
                                  <strong>{student.age} Years</strong>
                                </div>
                                <div className="mini-detail">
                                  <span>Vault Files:</span>
                                  <strong className="highlight-files">{fileCount} Files</strong>
                                </div>
                              </div>

                              <div className="student-card-footer">
                                <button
                                  type="button"
                                  className="gallery-icon-btn"
                                  onClick={() => setSelectedStudentForGallery(student)}
                                  title={`View ${student.name}'s File Vault Gallery`}
                                >
                                  <i className="fa-solid fa-images"></i>
                                  <span>Gallery ({fileCount})</span>
                                </button>
                                <button
                                  type="button"
                                  className="gallery-icon-btn id-card-btn"
                                  onClick={() => setSelectedStudentForIdCard(student)}
                                  title={`Generate ${student.name}'s Digital ID Card`}
                                >
                                  <i className="fa-solid fa-id-card"></i>
                                  <span>ID Card</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-admin-state">
                    <i className="fa-solid fa-users-slash empty-icon"></i>
                    <h3>No Students Found</h3>
                    <p>No student records matched your search query or department filter.</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Audit Logs Table */
          <div className="audit-log-section">
            <div className="audit-header">
              <h4><i className="fa-solid fa-clock-rotate-left"></i> System Activity Audit Logs</h4>
              <button
                type="button"
                className="mini-copy-btn"
                onClick={() => setAuditLogs([])}
              >
                Clear Audit History
              </button>
            </div>

            {auditLogs.length > 0 ? (
              <div className="audit-table-wrapper">
                <table className="audit-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Event Action</th>
                      <th>Details & Logs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id}>
                        <td className="log-time">{log.timestamp}</td>
                        <td className="log-action">
                          <span className="action-tag">{log.action}</span>
                        </td>
                        <td className="log-details">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-admin-state">
                <i className="fa-solid fa-shield-check empty-icon"></i>
                <h3>Audit Log Clean</h3>
                <p>No recent system activity recorded in this session.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gallery Modal */}
      {selectedStudentForGallery && (
        <StudentGalleryModal
          student={selectedStudentForGallery}
          files={files}
          onClose={() => setSelectedStudentForGallery(null)}
          onDeleteFile={handleDeleteFile}
        />
      )}

      {/* Student ID Card Modal */}
      {selectedStudentForIdCard && (
        <StudentIdCardModal
          student={selectedStudentForIdCard}
          onClose={() => setSelectedStudentForIdCard(null)}
        />
      )}

      {/* Bulk Import Modal */}
      {showBulkImportModal && (
        <BulkImportModal
          onClose={() => setShowBulkImportModal(false)}
          onSuccess={(msg) => {
            fetchData();
            showToast(msg, 'Bulk Import Success', 'success', 'fa-solid fa-file-import');
          }}
        />
      )}

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </section>
  );
}
