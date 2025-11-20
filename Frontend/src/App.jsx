import React, { useState } from 'react';
import AuthProvider, { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './dashboards/PatientDashboard';
import DoctorDashboard from './dashboards/DoctorDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

export default function App() {
  const [page, setPage] = useState('login');

  return (
    <AuthProvider>
      <MainApp page={page} setPage={setPage} />
    </AuthProvider>
  );
}

function MainApp({ page, setPage }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return page === 'login' ? (
      <Login onNavigate={setPage} />
    ) : (
      <Register onNavigate={setPage} />
    );
  }

  if (user.role === 'admin') {
    return <AdminDashboard />;
  } else if (user.role === 'doctor') {
    return <DoctorDashboard />;
  } else {
    return <PatientDashboard />;
  }
}

