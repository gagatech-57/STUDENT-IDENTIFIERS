import React, { useEffect } from 'react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type !== 'error';

  return (
    <div className={`toast-notification ${isSuccess ? 'success' : 'error'}`}>
      <div className="toast-icon">
        <i className={isSuccess ? (toast.icon || 'fa-solid fa-circle-check') : 'fa-solid fa-triangle-exclamation'}></i>
      </div>
      <div className="toast-content">
        <strong>{toast.title || (isSuccess ? 'Success' : 'Error')}</strong>
        <span>{toast.message}</span>
      </div>
      <button type="button" className="toast-close-btn" onClick={onClose}>
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
}
