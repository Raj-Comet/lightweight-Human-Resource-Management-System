import React, { useState, useEffect } from 'react';
import EmployeeManagement from './components/EmployeeManagement';
import AttendanceManagement from './components/AttendanceManagement';
import Dashboard from './components/Dashboard';
import { healthAPI } from './api/api';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [backendConnected, setBackendConnected] = useState(false);
  const [checkingBackend, setCheckingBackend] = useState(true);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      await healthAPI.check();
      setBackendConnected(true);
    } catch (err) {
      setBackendConnected(false);
      console.error('Backend connection error:', err);
    } finally {
      setCheckingBackend(false);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>🏢 HRMS Lite</h2>
          <span className={`status ${backendConnected ? 'connected' : 'disconnected'}`}>
            {backendConnected ? '✓ Connected' : '⚠ Backend Offline'}
          </span>
        </div>
        <div className="nav-links">
          <button
            className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-link ${currentPage === 'employees' ? 'active' : ''}`}
            onClick={() => setCurrentPage('employees')}
          >
            👥 Employees
          </button>
          <button
            className={`nav-link ${currentPage === 'attendance' ? 'active' : ''}`}
            onClick={() => setCurrentPage('attendance')}
          >
            📋 Attendance
          </button>
        </div>
      </nav>

      <main className="main-content">
        {checkingBackend ? (
          <div className="loading">
            <p>Checking backend connection...</p>
          </div>
        ) : !backendConnected ? (
          <div className="error-banner">
            <h2>⚠️ Backend Connection Error</h2>
            <p>Unable to connect to the backend API. Please check your API URL configuration.</p>
            <p>Configured API URL: {process.env.REACT_APP_API_URL || 'https://api.example.com'}</p>
            <button onClick={checkBackendConnection} className="retry-btn">
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'employees' && <EmployeeManagement />}
            {currentPage === 'attendance' && <AttendanceManagement />}
          </>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2024 HRMS Lite - Lightweight Human Resource Management System</p>
      </footer>
    </div>
  );
}

export default App;
