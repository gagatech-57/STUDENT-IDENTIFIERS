import axios from 'axios';

const API_BASE_URL = import.meta.env?.VITE_API_URL || (
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : 'https://student-identifiers.onrender.com'
);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function getFileUrl(item) {
  if (!item) return '';
  if (typeof item === 'object') {
    if (item.dataUrl) return item.dataUrl;
    item = item.url;
  }
  if (!item) return '';
  if (item.startsWith('data:') || item.startsWith('http://') || item.startsWith('https://')) return item;
  return `${API_BASE_URL}${item.startsWith('/') ? '' : '/'}${item}`;
}

export function formatUploadDateTime(dateString) {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Just now';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = String(hours).padStart(2, '0');

  return `${year}-${month}-${day} ${formattedHours}.${minutes} ${ampm}`;
}

export async function loginUser(email, password) {
  try {
    const response = await api.post('/login', {
      email: email.trim(),
      password: password.trim()
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Login failed');
  }
}

export async function registerUser({ name, age, department, email, password }) {
  try {
    const response = await api.post('/register', {
      name: name.trim(),
      age: Number(age),
      department: department.trim(),
      email: email.trim(),
      password: password.trim()
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Registration failed');
  }
}

export async function fetchUserUploads(userEmail) {
  try {
    const response = await api.get('/upload/files', {
      params: { uploadedBy: userEmail }
    });
    return response.data.files || [];
  } catch (err) {
    console.error('Failed to fetch uploads:', err);
    return [];
  }
}

export async function uploadSingleFile(file, uploadedByEmail) {
  const formData = new FormData();
  formData.append('photo', file);
  if (uploadedByEmail) {
    formData.append('uploadedBy', uploadedByEmail);
  }

  try {
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Upload failed');
  }
}

export async function deleteUserUpload(fileId) {
  try {
    const response = await api.delete(`/upload/${fileId}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to delete file');
  }
}
