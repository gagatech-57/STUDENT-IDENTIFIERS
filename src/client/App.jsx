import React from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  const auth = useAuth();

  return (
    <main className="container">
      {auth.isAuthenticated ? (
        <DashboardPage student={auth.student} onLogout={auth.logout} />
      ) : (
        <LoginPage auth={auth} />
      )}
    </main>
  );
}
