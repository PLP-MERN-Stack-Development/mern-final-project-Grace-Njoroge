import React, { useEffect, useState } from 'react';
import { Users, Calendar, TrendingUp, Settings } from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line
  }, []);

  const loadAppointments = async () => {
    const data = await apiService.getAppointments(token);
    if (Array.isArray(data)) setAppointments(data);
    else setAppointments([]);
  };

  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users },
    { label: 'Active Doctors', value: '45', icon: Users },
    { label: 'Total Appointments', value: appointments.length, icon: Calendar },
    { label: 'Platform Growth', value: '+12.5%', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="Admin" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <stat.icon className="text-blue-500" size={40} />
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Platform Overview</h2>
                <div className="space-y-4">
                  {appointments.slice(0, 5).map((apt) => (
                    <div key={apt._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <span className={`w-2 h-2 rounded-full ${
                        apt.status === 'approved' ? 'bg-green-500' :
                        apt.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></span>
                      <span className="text-sm text-gray-700">
                        {apt.patient?.name} booked with {apt.doctor?.name}
                      </span>
                      <span className="text-sm text-gray-500 ml-auto">
                        {new Date(apt.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold mb-4">User Management</h2>
                <p className="text-gray-600">Manage all platform users here.</p>
              </div>
            )}
            {activeTab === 'appointments' && (
              <div>
                <h2 className="text-xl font-bold mb-4">All Appointments</h2>
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <Card key={apt._id}>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Patient: {apt.patient?.name}</p>
                          <p className="text-sm text-gray-600">Doctor: {apt.doctor?.name}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(apt.date).toLocaleDateString()} at {apt.time}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm h-fit ${
                          apt.status === 'approved' ? 'bg-green-100 text-green-800' :
                          apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-bold mb-4">System Settings</h2>
                <p className="text-gray-600">Configure platform settings and preferences.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
