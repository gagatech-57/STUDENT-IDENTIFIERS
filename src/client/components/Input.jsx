import React, { useState } from 'react';

export function Input({ type = 'text', value, placeholder, icon, onChange, required = true }) {
  const isPasswordType = type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  const actualType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`input-box ${isPasswordType ? 'has-toggle' : ''}`}>
      <input
        type={actualType}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
      />
      {icon && <i className={icon}></i>}
      {isPasswordType && (
        <button
          type="button"
          className="password-toggle-btn"
          onClick={() => setShowPassword(!showPassword)}
          title={showPassword ? 'Hide password' : 'Show password'}
          tabIndex="-1"
        >
          <i className={showPassword ? 'fa-solid fa-eye-slash eye-icon active' : 'fa-solid fa-eye eye-icon'}></i>
        </button>
      )}
    </div>
  );
}
