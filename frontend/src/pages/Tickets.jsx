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

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/api/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error('FETCH TICKETS ERROR:', error.response?.data || error.message);
        setError('Failed to fetch tickets.');
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-2">
        {user?.role === 'admin' ? 'Manage Tickets' : 'My Tickets'}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <TicketForm
        tickets={tickets}
        setTickets={setTickets}
        editingTicket={editingTicket}
        setEditingTicket={setEditingTicket}
      />

      <TicketList
        tickets={tickets}
        setTickets={setTickets}
        setEditingTicket={setEditingTicket}
      />
    </div>
  );
};

export default Tickets;