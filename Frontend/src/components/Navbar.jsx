import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ role }) {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-blue-600">MediReach</h1>
          {role && <span className="text-sm text-gray-500">• {role}</span>}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">{user?.name}</div>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
