const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


async function handleRes(res) {
  const content = await res.json().catch(() => null);
  if (!res.ok) {
    return { message: content?.message || 'Request failed', status: res.status };
  }
  return content;
}

const apiService = {
  async login(credentials) {
    const res = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleRes(res);
  },

  async register(userData) {
    const res = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleRes(res);
  },

  async getAppointments(token) {
    const res = await fetch(`${API_URL}/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleRes(res);
  },

  async createAppointment(token, data) {
    const res = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

  async deleteAppointment(token, id) {
    const res = await fetch(`${API_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleRes(res);
  },

  async updateAppointment(token, id, updates) {
    const res = await fetch(`${API_URL}/appointments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    return handleRes(res);
  },
};

export default apiService;
