import { useEffect, useRef, useState } from 'react';
import api from '../axiosConfig';
import TicketList from '../components/TicketList';
import AdminTicketStatusForm from '../components/AdminTicketStatusForm';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const formRef = useRef(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets/admin/all');
        setTickets(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    if (editingTicket && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [editingTicket]);

  return (
    <div className="tickets-page">
      {error && <p className="error-text">{error}</p>}

      <div ref={formRef}>
        <AdminTicketStatusForm
          tickets={tickets}
          setTickets={setTickets}
          editingTicket={editingTicket}
          setEditingTicket={setEditingTicket}
        />
      </div>

      {loading ? (
        <div className="figma-table-card">
          <p className="empty-text">Loading tickets...</p>
        </div>
      ) : (
        <TicketList
          tickets={tickets}
          setTickets={setTickets}
          setEditingTicket={setEditingTicket}
          isAdmin={true}
        />
      )}
    </div>
  );
};

export default Tickets;