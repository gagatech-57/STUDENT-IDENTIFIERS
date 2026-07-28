import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Toast } from './components/Toast';

export default function App() {
  const auth = useAuth();
  const [toast, setToast] = useState(null);

  const showToast = (message, title = 'Notification', type = 'success', icon = 'fa-solid fa-circle-check') => {
    setToast({ message, title, type, icon, duration: 3500 });
  };

  const handleLogout = () => {
    auth.logout();
    showToast('You have been logged out successfully.', 'Logged Out', 'info', 'fa-solid fa-right-from-bracket');
  };

  const isAdmin = auth.student && (auth.student.isAdmin || auth.student.role === 'admin' || auth.student.email === 'gunaknn@gmail.com' || auth.student.email === 'admin@studentportal.com');

  return (
    <main className="container">
      {auth.isAuthenticated ? (
        isAdmin ? (
          <AdminDashboardPage admin={auth.student} onLogout={handleLogout} />
        ) : (
          <DashboardPage student={auth.student} onLogout={handleLogout} />
        )
      ) : (
        <LoginPage auth={auth} onToast={showToast} />
      )}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </main>
  );
}

