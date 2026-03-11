import React, { useState, useEffect } from 'react';
import { statsAPI } from '../api/api';
import { LoadingSpinner, ErrorAlert } from './UI';

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [employeeSummary, setEmployeeSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [dashResponse, summaryResponse] = await Promise.all([
        statsAPI.getDashboard(),
        statsAPI.getEmployeeSummary(),
      ]);
      setDashboardStats(dashResponse.data);
      setEmployeeSummary(summaryResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {dashboardStats && (
        <>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Employees</div>
              <div style={styles.statValue}>{dashboardStats.total_employees}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Attendance Records</div>
              <div style={styles.statValue}>{dashboardStats.total_attendance_records}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Attendance (Last 7 Days)</div>
              <div style={styles.statValue}>{dashboardStats.recent_attendance_7_days}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Present Last 7 Days</div>
              <div style={{ ...styles.statValue, color: '#10b981' }}>
                {dashboardStats.present_last_7_days}
              </div>
            </div>
          </div>

          {employeeSummary.length > 0 && (
            <div style={styles.summarySection}>
              <h2>Employee Attendance Summary</h2>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Total Records</th>
                      <th>Present</th>
                      <th>Absent</th>
                      <th>Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeSummary.map((emp, idx) => {
                      const total = emp.total_records;
                      const percentage = total > 0 ? ((emp.present_days / total) * 100).toFixed(1) : 0;
                      return (
                        <tr key={idx}>
                          <td>{emp.employee_id}</td>
                          <td>{emp.full_name}</td>
                          <td>{total}</td>
                          <td style={{ color: '#10b981', fontWeight: 500 }}>
                            {emp.present_days}
                          </td>
                          <td style={{ color: '#ef4444', fontWeight: 500 }}>
                            {emp.absent_days}
                          </td>
                          <td>
                            <div style={styles.progressBar}>
                              <div
                                style={{
                                  ...styles.progressFill,
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                            {percentage}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    marginBottom: '24px',
    color: '#1f2937',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2563eb',
  },
  summarySection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  tableContainer: {
    overflowX: 'auto',
    marginTop: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  progressBar: {
    width: '100px',
    height: '6px',
    backgroundColor: '#e5e7eb',
    borderRadius: '3px',
    overflow: 'hidden',
    marginRight: '8px',
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    transition: 'width 0.3s ease',
  },
};

export default Dashboard;
