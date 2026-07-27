import { useState, useCallback } from 'react';
import { loginUser, registerUser } from '../services/api';

export function useAuth() {
  const [student, setStudent] = useState(() => {
    try {
      const saved = localStorage.getItem('student');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('student', JSON.stringify(data.student));
      localStorage.setItem('token', data.token);
      setStudent(data.student);
      setToken(data.token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await registerUser(userData);
      localStorage.setItem('student', JSON.stringify(data.student));
      localStorage.setItem('token', data.token);
      setStudent(data.student);
      setToken(data.token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('student');
    localStorage.removeItem('token');
    setStudent(null);
    setToken('');
    setError('');
  }, []);

  return {
    student,
    token,
    isAuthenticated: !!student,
    isLoading,
    error,
    setError,
    login,
    register,
    logout
  };
}
