import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      return Promise.reject({
        status: error.response.status,
        message: error.response.data?.detail || error.message,
        data: error.response.data,
      });
    }
    return Promise.reject({
      status: 500,
      message: error.message || 'An error occurred',
    });
  }
);

// Employee API calls
export const employeeAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/api/employees?skip=${skip}&limit=${limit}`),
  getById: (employeeId) => api.get(`/api/employees/${employeeId}`),
  create: (data) => api.post('/api/employees', data),
  update: (employeeId, data) => api.put(`/api/employees/${employeeId}`, data),
  delete: (employeeId) => api.delete(`/api/employees/${employeeId}`),
};

// Attendance API calls
export const attendanceAPI = {
  getAll: (employeeId = null, startDate = null, endDate = null) => {
    const params = new URLSearchParams();
    if (employeeId) params.append('employee_id', employeeId);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return api.get(`/api/attendance?${params.toString()}`);
  },
  getByEmployee: (employeeId, skip = 0, limit = 100) =>
    api.get(`/api/attendance/employee/${employeeId}?skip=${skip}&limit=${limit}`),
  mark: (data) => api.post('/api/attendance', data),
};

// Dashboard/Stats API calls
export const statsAPI = {
  getDashboard: () => api.get('/api/stats/dashboard'),
  getEmployeeSummary: () => api.get('/api/stats/employee-summary'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
