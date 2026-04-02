import api from '../axiosConfig';

const TicketList = ({
  tickets,
  setTickets,
  setEditingTicket,
  isAdmin = false,
}) => {
  const handleDelete = async (ticketId) => {
    const confirmed = window.confirm('Are you sure you want to delete this ticket?');

    if (!confirmed) {
      return;
    }

    try {
      const endpoint = isAdmin
        ? `/api/tickets/admin/${ticketId}`
        : `/api/tickets/${ticketId}`;

      await api.delete(endpoint);

      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete ticket');
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Open') return 'badge badge-open';
    if (status === 'In Progress') return 'badge badge-progress';
    if (status === 'Resolved') return 'badge badge-resolved';
    if (status === 'Closed') return 'badge badge-closed';
    return 'badge';
  };

  const getPriorityClass = (priority) => {
    if (priority === 'High') return 'priority high';
    if (priority === 'Medium') return 'priority medium';
    return 'priority low';
  };

  if (!tickets.length) {
    return (
      <div className="card">
        <p>No tickets found.</p>
      </div>
    );
  }

  return (
    <div className="card table-card">
      <div className="table-scroll">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Subject</th>
              {isAdmin && <th>User</th>}
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>
                  <div className="ticket-subject">{ticket.subject}</div>
                  <div className="ticket-description">{ticket.description}</div>
                </td>

                {isAdmin && (
                  <td>
                    {ticket.user?.name || '-'}
                    <br />
                    <small>{ticket.user?.email || ''}</small>
                  </td>
                )}

                <td>{ticket.category}</td>
                <td>
                  <span className={getStatusClass(ticket.status)}>
                    {ticket.status}
                  </span>
                </td>
                <td>
                  <span className={getPriorityClass(ticket.priority)}>
                    {ticket.priority}
                  </span>
                </td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td>
                  {ticket.image ? (
                    <a href={ticket.image} target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="small-btn edit-btn"
                      onClick={() => setEditingTicket(ticket)}
                    >
                      Edit
                    </button>
                    <button
                      className="small-btn delete-btn"
                      onClick={() => handleDelete(ticket._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketList;