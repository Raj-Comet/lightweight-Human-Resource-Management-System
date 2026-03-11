import React, { useState, useEffect } from 'react';
import { attendanceAPI, employeeAPI } from '../api/api';
import {
  LoadingSpinner,
  ErrorAlert,
  EmptyState,
  SuccessAlert,
  Button,
  Modal,
} from './UI';

const AttendanceManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchAttendance();
    }
  }, [selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getByEmployee(selectedEmployee);
      setAttendance(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployee || !formData.date || !formData.status) {
      setError('Please fill all fields');
      return;
    }

    try {
      setError(null);
      await attendanceAPI.mark({
        employee_id: selectedEmployee,
        date: formData.date,
        status: formData.status,
      });
      setSuccess('Attendance marked successfully');
      setShowModal(false);
      setFormData({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
      });
      fetchAttendance();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmployeeSelect = (e) => {
    setSelectedEmployee(e.target.value);
    setAttendance([]);
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    const colors = {
      Present: '#10b981',
      Absent: '#ef4444',
    };
    return (
      <span style={{
        ...styles.badge,
        backgroundColor: colors[status] || '#6b7280',
      }}>
        {status}
      </span>
    );
  };

  if (employees.length === 0 && loading) {
    return <LoadingSpinner message="Loading employees..." />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Attendance Management</h1>
        <Button onClick={() => setShowModal(true)}>+ Mark Attendance</Button>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      {success && <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />}

      {employees.length === 0 ? (
        <EmptyState
          title="No Employees"
          message="Add employees first before marking attendance"
          icon="📋"
        />
      ) : (
        <>
          <div style={styles.selectContainer}>
            <label style={styles.label}>Select Employee:</label>
            <select
              value={selectedEmployee}
              onChange={handleEmployeeSelect}
              style={styles.select}
            >
              <option value="">-- Choose an employee --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>

          {selectedEmployee && (
            <>
              {loading ? (
                <LoadingSpinner message="Loading attendance..." />
              ) : attendance.length === 0 ? (
                <EmptyState
                  title="No Attendance Records"
                  message="No attendance records found for this employee"
                  icon="📅"
                />
              ) : (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Marked On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map(record => (
                        <tr key={record.id}>
                          <td>{formatDate(record.date)}</td>
                          <td>{getStatusBadge(record.status)}</td>
                          <td>{formatDate(record.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </>
      )}

      <Modal
        isOpen={showModal}
        title="Mark Attendance"
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Employee *</label>
            <select
              value={selectedEmployee}
              onChange={handleEmployeeSelect}
              style={styles.select}
            >
              <option value="">-- Select Employee --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              style={styles.input}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              style={styles.select}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <div style={styles.formActions}>
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Mark Attendance</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  selectContainer: {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  label: {
    fontWeight: 500,
    fontSize: '14px',
    color: '#374151',
    marginBottom: '8px',
    display: 'block',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '12px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '13px',
    fontWeight: 500,
  },
};

export default AttendanceManagement;
