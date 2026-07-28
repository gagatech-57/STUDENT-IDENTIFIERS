import React, { useEffect } from 'react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const type = toast.type || 'success';

  return (
    <div className={`toast-notification ${type}`}>
      <div className="toast-icon">
        <i className={toast.icon || (type === 'success' ? 'fa-solid fa-circle-check' : type === 'info' ? 'fa-solid fa-circle-info' : 'fa-solid fa-triangle-exclamation')}></i>
      </div>
      <div className="toast-content">
        <strong>{toast.title || (type === 'success' ? 'Success' : type === 'info' ? 'Notice' : 'Error')}</strong>
        <span>{toast.message}</span>
      </div>
      <button type="button" className="toast-close-btn" onClick={onClose} aria-label="Close Toast Notification">
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
}
