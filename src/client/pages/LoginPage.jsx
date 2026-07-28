import React, { useState } from 'react';
import { Input } from '../components/Input';

export function LoginPage({ auth }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    department: '',
    email: '',
    password: ''
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await auth.login(formData.email, formData.password);
      } else {
        await auth.register(formData);
      }
    } catch (err) {
      // Error handled in auth hook
    }
  };

  return (
    <section className="auth-box">
      <div className="brand-header" style={{ textCenter: 'center', marginBottom: '1.2rem' }}>
        <span className="brand-badge">
          <i className="fa-solid fa-id-card-clip"></i> Student Identifiers
        </span>
      </div>

      <div className="auth-tabs">
        <button
          type="button"
          className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
          onClick={() => { setMode('login'); auth.setError(''); }}
        >
          Sign In
        </button>
        <button
          type="button"
          className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
          onClick={() => { setMode('register'); auth.setError(''); }}
        >
          Create Account
        </button>
      </div>

      <h1>{mode === 'login' ? 'Welcome Back' : 'Join Student Identifiers'}</h1>

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <>
            <Input
              type="text"
              placeholder="Full Name"
              icon="fa-solid fa-user"
              value={formData.name}
              onChange={handleChange('name')}
            />
            <Input
              type="number"
              placeholder="Age"
              icon="fa-solid fa-calendar"
              value={formData.age}
              onChange={handleChange('age')}
            />
            <Input
              type="text"
              placeholder="Department (e.g. Computer Science)"
              icon="fa-solid fa-building-columns"
              value={formData.department}
              onChange={handleChange('department')}
            />
          </>
        )}

        <Input
          type="email"
          placeholder="Student Email"
          icon="fa-solid fa-envelope"
          value={formData.email}
          onChange={handleChange('email')}
        />
        <Input
          type="password"
          placeholder="Password"
          icon="fa-solid fa-lock"
          value={formData.password}
          onChange={handleChange('password')}
        />

        <button type="submit" className="auth-submit-btn" disabled={auth.isLoading}>
          {auth.isLoading ? (
            <span className="btn-flex"><i className="fa-solid fa-spinner fa-spin"></i> Processing...</span>
          ) : (
            mode === 'login' ? 'Login to Portal' : 'Create Account'
          )}
        </button>
      </form>

      {auth.error && <div id="error">{auth.error}</div>}
    </section>
  );
}
