/**
 * Main App Component with React Router Navigation & Protected Routes
 */

import { useAuth } from "./hooks/useAuth.js";
import { useUploads } from "./hooks/useUploads.js";
import { LoginPage } from "./pages/LoginPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";

const { HashRouter, Routes, Route, Navigate } = ReactRouterDOM;

export function App() {
    const {
        student,
        isAuthenticated,
        isLoading: authLoading,
        error: authError,
        login,
        register,
        logout
    } = useAuth();

    const uploadsState = useUploads(student ? student.email : null);

    return (
        <HashRouter>
            <main className="container">
                <Routes>
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/dashboard" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/dashboard" replace />
                            ) : (
                                <LoginPage
                                    onLogin={login}
                                    onRegister={register}
                                    isLoading={authLoading}
                                    authError={authError}
                                />
                            )
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            isAuthenticated ? (
                                <DashboardPage
                                    student={student}
                                    onLogout={logout}
                                    uploadsState={uploadsState}
                                />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
        </HashRouter>
    );
}
