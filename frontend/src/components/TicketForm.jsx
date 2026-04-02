import { useEffect, useState } from 'react';
import api from '../axiosConfig';

const TicketForm = ({
  tickets,
  setTickets,
  editingTicket,
  setEditingTicket,
  isAdmin = false,
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'Other',
    priority: 'Medium',
    status: 'Open',
    image: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTicket) {
      setFormData({
        subject: editingTicket.subject || '',
        description: editingTicket.description || '',
        category: editingTicket.category || 'Other',
        priority: editingTicket.priority || 'Medium',
        status: editingTicket.status || 'Open',
        image: editingTicket.image || '',
      });
    } else {
      setFormData({
        subject: '',
        description: '',
        category: 'Other',
        priority: 'Medium',
        status: 'Open',
        image: '',
      });
    }
  }, [editingTicket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setFormData({
      subject: '',
      description: '',
      category: 'Other',
      priority: 'Medium',
      status: 'Open',
      image: '',
    });
    setEditingTicket(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (!editingTicket) {
        const payload = {
          subject: formData.subject,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          image: formData.image,
        };

        const response = await api.post('/api/tickets', payload);
        setTickets([response.data, ...tickets]);
      } else {
        const payload = {
          subject: formData.subject,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          image: formData.image,
        };

        if (isAdmin) {
          payload.status = formData.status;
        }

        const endpoint = isAdmin
          ? `/api/tickets/admin/${editingTicket._id}`
          : `/api/tickets/${editingTicket._id}`;

        const response = await api.put(endpoint, payload);

        setTickets(
          tickets.map((ticket) =>
            ticket._id === editingTicket._id ? response.data : ticket
          )
        );
      }

      clearForm();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card form-card">
      <h3>{editingTicket ? 'Edit Ticket' : 'Create Ticket'}</h3>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-row">
          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter ticket subject"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Account">Account</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {isAdmin && editingTicket && (
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue"
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Paste image link here (optional)"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting
              ? 'Saving...'
              : editingTicket
              ? 'Update Ticket'
              : 'Create Ticket'}
          </button>

          {editingTicket && (
            <button
              type="button"
              className="secondary-btn"
              onClick={clearForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TicketForm;