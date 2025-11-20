import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
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

  const handleAccept = async (id) => {
    await apiService.updateAppointment(token, id, { status: 'approved' });
    loadAppointments();
  };

  const handleDecline = async (id) => {
    await apiService.updateAppointment(token, id, { status: 'cancelled' });
    loadAppointments();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="Doctor" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Doctor Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <p className="text-sm text-gray-600">Total Appointments</p>
            <p className="text-3xl font-bold mt-2">{appointments.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-3xl font-bold mt-2">{appointments.filter(a => a.status === 'pending').length}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-3xl font-bold mt-2">{appointments.filter(a => a.status === 'approved').length}</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-bold mb-4">My Appointments</h2>
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Patient: {apt.patient?.name}</p>
                    <p className="text-sm text-gray-600">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                    <p className="text-sm text-gray-600 mt-2">Reason: {apt.reason}</p>
                  </div>
                  <div className="flex gap-2">
                    {apt.status === 'pending' && (
                      <>
                        <Button onClick={() => handleAccept(apt._id)} variant="success" icon={CheckCircle}>
                          Accept
                        </Button>
                        <Button onClick={() => handleDecline(apt._id)} variant="danger" icon={XCircle}>
                          Decline
                        </Button>
                      </>
                    )}
                    {apt.status !== 'pending' && (
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        apt.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {apt.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
