export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div style={styles.loadingContainer}>
    <div style={styles.spinner}></div>
    <p>{message}</p>
  </div>
);

export const ErrorAlert = ({ message, onDismiss }) => (
  <div style={styles.errorAlert}>
    <strong>Error: </strong> {message}
    {onDismiss && (
      <button onClick={onDismiss} style={styles.closeBtn}>✕</button>
    )}
  </div>
);

export const EmptyState = ({ title, message, icon = '📭' }) => (
  <div style={styles.emptyContainer}>
    <div style={styles.emptyIcon}>{icon}</div>
    <h3>{title}</h3>
    <p>{message}</p>
  </div>
);

export const SuccessAlert = ({ message, onDismiss }) => (
  <div style={styles.successAlert}>
    <strong>✓ Success: </strong> {message}
    {onDismiss && (
      <button onClick={onDismiss} style={styles.closeBtn}>✕</button>
    )}
  </div>
);

export const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', ...props }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    style={{
      ...styles.button,
      ...styles[`button_${variant}`],
      ...styles[`button_${size}`],
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}
    {...props}
  >
    {children}
  </button>
);

export const Card = ({ children, ...props }) => (
  <div style={styles.card} {...props}>
    {children}
  </div>
);

export const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <>
      <div style={styles.modalOverlay} onClick={onClose} />
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2>{title}</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <div style={styles.modalBody}>{children}</div>
        <div style={styles.modalFooter}>
          <Button variant="secondary" onClick={onClose}>{cancelText}</Button>
          {onConfirm && <Button onClick={onConfirm}>{confirmText}</Button>}
        </div>
      </div>
    </>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    minHeight: '200px',
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #2563eb',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  },
  errorAlert: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successAlert: {
    backgroundColor: '#dcfce7',
    border: '1px solid #86efac',
    color: '#166534',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    fontWeight: 500,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  button_primary: {
    backgroundColor: '#2563eb',
    color: 'white',
  },
  button_secondary: {
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
  },
  button_danger: {
    backgroundColor: '#dc2626',
    color: 'white',
  },
  button_md: {
    padding: '10px 16px',
    fontSize: '14px',
  },
  button_sm: {
    padding: '6px 12px',
    fontSize: '12px',
  },
  button_lg: {
    padding: '12px 24px',
    fontSize: '16px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '20px',
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    zIndex: 1001,
    maxWidth: '500px',
    width: '90%',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  modalHeader: {
    borderBottom: '1px solid #e5e7eb',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalBody: {
    padding: '20px',
    maxHeight: '60vh',
    overflowY: 'auto',
  },
  modalFooter: {
    borderTop: '1px solid #e5e7eb',
    padding: '16px 20px',
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#6b7280',
  },
};
