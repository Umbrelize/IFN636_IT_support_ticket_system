import { useEffect, useState } from 'react';
import api from '../axiosConfig';
import TicketForm from '../components/TicketForm';
import TicketList from '../components/TicketList';
import { useAuth } from '../context/AuthContext';

const Tickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/api/tickets');
        setTickets(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="main-content">
      <div className="top-header">
        <div>
          <h1>{user?.role === 'admin' ? 'Manage Tickets' : 'My Tickets'}</h1>
          <p>Create and manage support tickets</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <TicketForm
        tickets={tickets}
        setTickets={setTickets}
        editingTicket={editingTicket}
        setEditingTicket={setEditingTicket}
      />

      {loading ? (
        <div className="card">
          <p>Loading tickets...</p>
        </div>
      ) : (
        <TicketList
          tickets={tickets}
          setTickets={setTickets}
          setEditingTicket={setEditingTicket}
        />
      )}
    </div>
  );
};

export default Tickets;