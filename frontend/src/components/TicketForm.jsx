import { useEffect, useState } from 'react';
import api, { BACKEND_BASE_URL } from '../axiosConfig';

const TicketForm = ({
  tickets = [],
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
    image: null,
  });

  const [existingImage, setExistingImage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
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
        image: null,
      });

      setExistingImage(editingTicket.image || '');
      setPreviewUrl('');
    } else {
      setFormData({
        subject: '',
        description: '',
        category: 'Other',
        priority: 'Medium',
        status: 'Open',
        image: null,
      });

      setExistingImage('');
      setPreviewUrl('');
    }
  }, [editingTicket]);

  useEffect(() => {
    if (!formData.image) return;

    const objectUrl = URL.createObjectURL(formData.image);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const clearForm = () => {
    setFormData({
      subject: '',
      description: '',
      category: 'Other',
      priority: 'Medium',
      status: 'Open',
      image: null,
    });

    setExistingImage('');
    setPreviewUrl('');
    setError('');

    if (setEditingTicket) {
      setEditingTicket(null);
    }
  };

  const buildPayload = () => {
    const payload = new FormData();

    payload.append('subject', formData.subject);
    payload.append('description', formData.description);
    payload.append('category', formData.category);
    payload.append('priority', formData.priority);

    if (isAdmin) {
      payload.append('status', formData.status);
    }

    if (formData.image) {
      payload.append('image', formData.image);
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = buildPayload();

      if (!editingTicket) {
        const response = await api.post('/tickets', payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (setTickets) {
          setTickets([response.data, ...tickets]);
        }
      } else {
        const endpoint = isAdmin
          ? `/tickets/admin/${editingTicket._id}`
          : `/tickets/${editingTicket._id}`;

        const response = await api.put(endpoint, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (setTickets) {
          setTickets(
            tickets.map((ticket) =>
              ticket._id === editingTicket._id ? response.data : ticket
            )
          );
        }
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
      <h3>{editingTicket ? 'Edit Ticket' : 'Create New Ticket'}</h3>

      <p
        style={{
          margin: '0 0 20px',
          fontSize: '14px',
          color: '#8a94a6',
        }}
      >
        {editingTicket
          ? 'Update your ticket details below.'
          : 'Please provide specific details so we can assist you better.'}
      </p>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group">
          <label>Ticket Title</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Briefly describe the issue"
            required
          />
        </div>

        <div className="form-row">
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

          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low - General inquiry</option>
              <option value="Medium">Medium - Normal issue</option>
              <option value="High">High - Urgent problem</option>
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
            rows="5"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide detailed steps to reproduce or details about your request..."
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          {previewUrl && (
            <div style={{ marginTop: '12px' }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: '140px',
                  height: 'auto',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                }}
              />
            </div>
          )}

          {!previewUrl && existingImage && (
            <div style={{ marginTop: '12px' }}>
              <img
                src={`${BACKEND_BASE_URL}${existingImage}`}
                alt="Current ticket"
                style={{
                  width: '140px',
                  height: 'auto',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                }}
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          {editingTicket && (
            <button
              type="button"
              className="secondary-btn"
              onClick={clearForm}
            >
              Cancel
            </button>
          )}

          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting
              ? 'Saving...'
              : editingTicket
              ? 'Update Ticket'
              : 'Submit Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;