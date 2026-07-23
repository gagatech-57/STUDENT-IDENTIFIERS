/**
 * Custom hook for Authentication State Management
 */

import { loginUser, registerUser } from "../services/api.js";

export function useAuth() {
    const [student, setStudent] = React.useState(() => {
        try {
            const saved = localStorage.getItem("student");
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    const [token, setToken] = React.useState(() => localStorage.getItem("token") || "");
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const login = React.useCallback(async (email, password) => {
        setIsLoading(true);
        setError("");
        try {
            const data = await loginUser(email, password);
            localStorage.setItem("student", JSON.stringify(data.student));
            localStorage.setItem("token", data.token);
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

    const register = React.useCallback(async (userData) => {
        setIsLoading(true);
        setError("");
        try {
            const data = await registerUser(userData);
            localStorage.setItem("student", JSON.stringify(data.student));
            localStorage.setItem("token", data.token);
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

    const logout = React.useCallback(() => {
        localStorage.removeItem("student");
        localStorage.removeItem("token");
        setStudent(null);
        setToken("");
        setError("");
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
