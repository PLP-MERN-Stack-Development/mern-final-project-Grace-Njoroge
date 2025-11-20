import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Search, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('book');
  const [appointments, setAppointments] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line
  }, []);

  const loadAppointments = async () => {
    const data = await apiService.getAppointments(token);
    // handle array or error object
    if (Array.isArray(data)) setAppointments(data);
    else setAppointments([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="Patient" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Patient Dashboard</h1>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {[
                { id: 'book', label: 'Book Appointment', icon: Calendar },
                { id: 'appointments', label: 'My Appointments', icon: Clock },
                { id: 'doctors', label: 'Find Doctors', icon: Search },
                { id: 'profile', label: 'Profile', icon: User },
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
            {activeTab === 'book' && <BookAppointment token={token} onSuccess={loadAppointments} />}
            {activeTab === 'appointments' && <MyAppointments appointments={appointments} token={token} onUpdate={loadAppointments} />}
            {activeTab === 'doctors' && <DoctorDirectory />}
            {activeTab === 'profile' && <Profile user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

/* Sub-components (kept in same file for clarity) */

export const BookAppointment = ({ token, onSuccess }) => {
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    reason: '',
  });
  const [success, setSuccess] = useState('');

  const doctors = [
    { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
    { id: '2', name: 'Dr. Michael Chen', specialty: 'Pediatrics' },
    { id: '3', name: 'Dr. Emily Davis', specialty: 'Dermatology' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await apiService.createAppointment(token, formData);
    setSuccess('Appointment booked successfully!');
    setFormData({ doctor: '', date: '', time: '', reason: '' });
    if (onSuccess) onSuccess();
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
          <select
            value={formData.doctor}
            onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Choose a doctor...</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} - {doc.specialty}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        <Button type="submit" icon={Calendar}>
          Book Appointment
        </Button>
      </form>
    </div>
  );
};

export const MyAppointments = ({ appointments, token, onUpdate }) => {
  const handleCancel = async (id) => {
    if (window.confirm('Cancel this appointment?')) {
      await apiService.deleteAppointment(token, id);
      if (onUpdate) onUpdate();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Appointments</h2>

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">No appointments yet. Book one to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <Card key={apt._id} className="hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-lg">Dr. {apt.doctor?.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <Clock size={14} className="inline mr-1" />
                    {new Date(apt.date).toLocaleDateString()} at {apt.time}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Reason:</strong> {apt.reason}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    apt.status === 'approved' ? 'bg-green-100 text-green-800' :
                    apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {apt.status}
                  </span>
                  {apt.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(apt._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export const DoctorDirectory = () => {
  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', rating: 4.8 },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Pediatrics', rating: 4.9 },
    { id: 3, name: 'Dr. Emily Davis', specialty: 'Dermatology', rating: 4.7 },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Find Doctors</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <Card key={doc.id} className="text-center hover:shadow-lg transition">
            <div className="text-5xl mb-3">👨‍⚕️</div>
            <h3 className="font-bold text-lg">{doc.name}</h3>
            <p className="text-blue-600 text-sm">{doc.specialty}</p>
            <div className="mt-2">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 text-sm">{doc.rating}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const Profile = ({ user }) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
    <div className="max-w-2xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input type="text" defaultValue={user?.name} className="w-full px-4 py-2 border rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" defaultValue={user?.email} className="w-full px-4 py-2 border rounded-lg bg-gray-50" disabled />
      </div>
      <Button>Update Profile</Button>
    </div>
  </div>
);
