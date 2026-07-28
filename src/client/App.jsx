import React from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Su57Loader } from './components/Su57Loader';

export default function App() {
  const auth = useAuth();
  const isAdmin = auth.student && (auth.student.isAdmin || auth.student.role === 'admin' || auth.student.email === 'gunaknn@gmail.com');

  return (
    <main className="container">
      {auth.isLoading && (
        <Su57Loader text="SU-57 STEALTH AUTHENTICATION IN PROGRESS..." />
      )}
      {auth.isAuthenticated ? (
        isAdmin ? (
          <AdminDashboardPage admin={auth.student} onLogout={auth.logout} />
        ) : (
          <DashboardPage student={auth.student} onLogout={auth.logout} />
        )
      ) : (
        <LoginPage auth={auth} />
      )}
    </main>
  );
}

