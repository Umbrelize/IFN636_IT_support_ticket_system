import { useEffect, useState } from 'react';
import api from '../axiosConfig';

const AdminTicketStatusForm = ({
  tickets = [],
  setTickets,
  editingTicket,
  setEditingTicket,
}) => {
  const [status, setStatus] = useState('Open');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTicket) {
      setStatus(editingTicket.status || 'Open');
    }
  }, [editingTicket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingTicket) return;

    setError('');
    setSubmitting(true);

    try {
      const response = await api.put(`/tickets/admin/${editingTicket._id}`, {
        status,
      });

      if (setTickets) {
        setTickets(
          tickets.map((ticket) =>
            ticket._id === editingTicket._id ? { ...ticket, ...response.data } : ticket
          )
        );
      }

      setEditingTicket(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update ticket status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingTicket(null);
    setError('');
  };

  if (!editingTicket) {
    return null;
  }

  return (
    <div className="card form-card admin-status-card">
      <h3>Update Ticket Status</h3>
      <p
        style={{
          margin: '0 0 20px',
          fontSize: '14px',
          color: '#8a94a6',
        }}
      >
        Review the selected ticket and update its current status.
      </p>

      {error && <p className="error-text">{error}</p>}

      <div className="admin-ticket-summary">
        <div className="summary-row">
          <span className="summary-label">Subject</span>
          <span className="summary-value">{editingTicket.subject}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">User</span>
          <span className="summary-value">
            {editingTicket.user?.name || '-'}
            {editingTicket.user?.email ? ` (${editingTicket.user.email})` : ''}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Category</span>
          <span className="summary-value">{editingTicket.category || '-'}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Priority</span>
          <span className="summary-value">{editingTicket.priority || '-'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group form-group-sm">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={handleCancel}>
            Cancel
          </button>

          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting ? 'Saving...' : 'Update Status'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminTicketStatusForm;