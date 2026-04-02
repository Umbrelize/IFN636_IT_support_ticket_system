import { useEffect, useState } from 'react';
import api from '../axiosConfig';

const TicketForm = ({ tickets, setTickets, editingTicket, setEditingTicket }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'Other',
    priority: 'Medium',
    status: 'Open',
  });

  useEffect(() => {
    if (editingTicket) {
      setFormData({
        subject: editingTicket.subject || '',
        description: editingTicket.description || '',
        category: editingTicket.category || 'Other',
        priority: editingTicket.priority || 'Medium',
        status: editingTicket.status || 'Open',
      });
    } else {
      setFormData({
        subject: '',
        description: '',
        category: 'Other',
        priority: 'Medium',
        status: 'Open',
      });
    }
  }, [editingTicket]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTicket) {
        const response = await api.put(`/api/tickets/${editingTicket._id}`, formData);
        setTickets(
          tickets.map((ticket) =>
            ticket._id === editingTicket._id ? response.data : ticket
          )
        );
      } else {
        const response = await api.post('/api/tickets', formData);
        setTickets([response.data, ...tickets]);
      }

      setEditingTicket(null);
      setFormData({
        subject: '',
        description: '',
        category: 'Other',
        priority: 'Medium',
        status: 'Open',
      });
    } catch (error) {
      console.error('SAVE TICKET ERROR:', error.response?.data || error.message);
      alert('Failed to save ticket.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8">
      <h2 className="text-2xl font-bold mb-4">
        {editingTicket ? 'Edit Ticket' : 'Create Ticket'}
      </h2>

      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={formData.subject}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        rows="4"
        required
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="Hardware">Hardware</option>
        <option value="Software">Software</option>
        <option value="Network">Network</option>
        <option value="Account">Account</option>
        <option value="Other">Other</option>
      </select>

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
        <option value="Closed">Closed</option>
      </select>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {editingTicket ? 'Update Ticket' : 'Create Ticket'}
      </button>
    </form>
  );
};

export default TicketForm;