import api from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TicketList = ({ tickets, setTickets, setEditingTicket }) => {
  const { user } = useAuth();

  const handleDelete = async (ticketId) => {
    try {
      await api.delete(`/api/tickets/${ticketId}`);
      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
    } catch (error) {
      console.error('DELETE TICKET ERROR:', error.response?.data || error.message);
      alert('Failed to delete ticket.');
    }
  };

  if (!tickets.length) {
    return <p>No tickets found.</p>;
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div key={ticket._id} className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-bold">{ticket.subject}</h3>
          <p className="mb-2">{ticket.description}</p>
          <p><strong>Category:</strong> {ticket.category}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <p><strong>Status:</strong> {ticket.status}</p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setEditingTicket(ticket)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(ticket._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>

            {user?.role === 'admin' && (
              <span className="ml-auto text-sm text-gray-500">
                Admin can manage all tickets
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketList;