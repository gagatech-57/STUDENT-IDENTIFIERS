/**
 * Centralized API Service for Auth and Upload endpoints
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
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }
    return data;
}

export async function registerUser({ name, age, department, email, password }) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name.trim(),
            age: Number(age),
            department: department.trim(),
            email: email.trim(),
            password: password.trim()
        })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }
    return data;
}

export async function fetchUserUploads(userEmail) {
    const response = await fetch(`${API_BASE_URL}/upload/files?uploadedBy=${encodeURIComponent(userEmail)}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch uploads");
    }
    return data.files || [];
}

export async function uploadSingleFile(file, uploadedByEmail) {
    const formData = new FormData();
    formData.append("photo", file);
    if (uploadedByEmail) {
        formData.append("uploadedBy", uploadedByEmail);
    }

    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Upload failed");
    }
    return data;
}
