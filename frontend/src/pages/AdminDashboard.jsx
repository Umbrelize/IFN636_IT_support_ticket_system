import { useEffect, useMemo, useState } from 'react';
import api from '../axiosConfig';
import TicketForm from '../components/TicketForm';
import TicketList from '../components/TicketList';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const response = await api.get('/api/tickets/admin/all');
        setTickets(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load admin dashboard');
      }
    };

    fetchAllTickets();
  }, []);

  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((ticket) => ticket.status === 'Open').length;
    const inProgress = tickets.filter((ticket) => ticket.status === 'In Progress').length;
    const closed = tickets.filter((ticket) => ticket.status === 'Closed').length;

    return { total, open, inProgress, closed };
  }, [tickets]);

  return (
    <div className="main-content">
      <div className="top-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tickets</h3>
          <p>{stats.total}</p>
        </div>

        <div className="stat-card">
          <h3>Open Tickets</h3>
          <p>{stats.open}</p>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <p>{stats.inProgress}</p>
        </div>

        <div className="stat-card">
          <h3>Closed Tickets</h3>
          <p>{stats.closed}</p>
        </div>
      </div>

      <TicketForm
        tickets={tickets}
        setTickets={setTickets}
        editingTicket={editingTicket}
        setEditingTicket={setEditingTicket}
        isAdmin={true}
      />

      <TicketList
        tickets={tickets}
        setTickets={setTickets}
        setEditingTicket={setEditingTicket}
        isAdmin={true}
      />
    </div>
  );
};

export default AdminDashboard;