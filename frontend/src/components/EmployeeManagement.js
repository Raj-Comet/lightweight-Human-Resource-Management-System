import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../api/api';
import {
  LoadingSpinner,
  ErrorAlert,
  EmptyState,
  SuccessAlert,
  Button,
  Card,
  Modal,
} from './UI';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
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

  const validateForm = () => {
    if (!formData.employee_id.trim()) return 'Employee ID is required';
    if (!formData.full_name.trim()) return 'Full name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    if (!formData.department.trim()) return 'Department is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError(null);
      
      if (editingId) {
        await employeeAPI.update(editingId, {
          full_name: formData.full_name,
          email: formData.email,
          department: formData.department,
        });
        setSuccess('Employee updated successfully');
      } else {
        await employeeAPI.create(formData);
        setSuccess('Employee created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.employee_id);
    setFormData({
      employee_id: employee.employee_id,
      full_name: employee.full_name,
      email: employee.email,
      department: employee.department,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      setError(null);
      await employeeAPI.delete(deleteConfirm);
      setSuccess('Employee deleted successfully');
      setDeleteConfirm(null);
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      full_name: '',
      email: '',
      department: '',
    });
    setEditingId(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) return <LoadingSpinner message="Loading employees..." />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Employee Management</h1>
        <Button onClick={() => { resetForm(); setShowModal(true); }}>
          + Add New Employee
        </Button>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      {success && <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />}

      {employees.length === 0 ? (
        <EmptyState
          title="No Employees Yet"
          message="Start by adding your first employee"
          icon="👥"
        />
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.employee_id}</td>
                  <td>{emp.full_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>
                    <div style={styles.actions}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(emp)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteConfirm(emp.employee_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showModal}
        title={editingId ? 'Edit Employee' : 'Add New Employee'}
        onClose={handleModalClose}
      >
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Employee ID *</label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleInputChange}
              disabled={editingId !== null}
              style={styles.input}
              placeholder="E.g., EMP001"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="John Doe"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="john@example.com"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Department *</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="HR"
            />
          </div>
          <div style={styles.formActions}>
            <Button variant="secondary" type="button" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingId ? 'Update' : 'Create'} Employee
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleteConfirm}
        title="Confirm Delete"
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        confirmText="Delete"
      >
        <p>Are you sure you want to delete employee <strong>{deleteConfirm}</strong>?</p>
        <p>This action will also remove all associated attendance records.</p>
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
  label: {
    fontWeight: 500,
    fontSize: '14px',
    color: '#374151',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '12px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
};

export default EmployeeManagement;
