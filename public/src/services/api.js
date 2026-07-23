/**
 * Centralized API Service for Auth and Upload endpoints using Axios
 * Matches notebook implementation using axios.post and axios.get
 */

export const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://server-testing-skra.onrender.com";

export function getFileUrl(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function loginUser(email, password) {
    try {
        const response = await window.axios.post(`${API_BASE_URL}/login`, {
            email: email.trim(),
            password: password.trim()
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message || "Login failed");
    }
}

export async function registerUser({ name, age, department, email, password }) {
    try {
        const response = await window.axios.post(`${API_BASE_URL}/register`, {
            name: name.trim(),
            age: Number(age),
            department: department.trim(),
            email: email.trim(),
            password: password.trim()
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message || "Registration failed");
    }
}

export async function addStudent(name, age, department) {
    try {
        const response = await window.axios.post(`${API_BASE_URL}/students`, {
            name: name.trim(),
            age: Number(age),
            department: department.trim()
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message || "Failed to add student");
    }
}

export async function fetchUserUploads(userEmail) {
    try {
        const response = await window.axios.get(`${API_BASE_URL}/upload/files`, {
            params: { uploadedBy: userEmail }
        });
        return response.data.files || [];
    } catch (err) {
        console.error("Failed to fetch uploads:", err);
        return [];
    }
}

export async function uploadSingleFile(file, uploadedByEmail) {
    const formData = new FormData();
    formData.append("photo", file);
    if (uploadedByEmail) {
        formData.append("uploadedBy", uploadedByEmail);
    }

    try {
        const response = await window.axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message || "Upload failed");
    }
}
