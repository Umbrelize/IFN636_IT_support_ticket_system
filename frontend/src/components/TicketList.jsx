import api from '../axiosConfig';
import { Link } from 'react-router-dom';

const TicketList = ({
  tickets = [],
  setTickets,
  setEditingTicket,
  isAdmin = false,
}) => {
  const handleDelete = async (ticketId) => {
    const confirmed = window.confirm('Are you sure you want to delete this ticket?');
    if (!confirmed) return;

    try {
      const endpoint = isAdmin
        ? `/tickets/admin/${ticketId}`
        : `/tickets/${ticketId}`;

      await api.delete(endpoint);

      if (setTickets) {
        setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
      }
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
    if (priority === 'High') return 'priority-inline high-text';
    if (priority === 'Medium') return 'priority-inline medium-text';
    return 'priority-inline low-text';
  };

  if (!tickets || tickets.length === 0) {
    return (
      <div className="figma-table-card">
        <p className="empty-text">No tickets found.</p>
      </div>
    );
  }

  return (
    <div className="figma-table-card ticket-list-wrap">
      <div className="table-scroll">
        <table className="figma-table figma-ticket-table">
          <thead>
            <tr>
              <th className="col-id">Ticket ID</th>
              {isAdmin && <th className="col-user">User</th>}
              <th className="col-title">Issue Title</th>
              <th className="col-category">Category</th>
              <th className="col-status">Status</th>
              <th className="col-priority">Priority</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket._id}>
                <td className="ticket-id col-id">#TK-{4820 - index}</td>

                {isAdmin && (
                  <td className="col-user">
                    <div className="user-cell">
                      <div className="mini-avatar">👤</div>
                      <div>
                        <div className="user-name">{ticket.user?.name || '-'}</div>
                        <div className="user-sub">{ticket.user?.email || ''}</div>
                      </div>
                    </div>
                  </td>
                )}

                <td className="issue-title col-title">
                  <div className="title-clamp">{ticket.subject}</div>
                </td>

                <td className="col-category">
                  <span className="category-tag">{ticket.category}</span>
                </td>

                <td className="col-status">
                  <span className={getStatusClass(ticket.status)}>
                    {ticket.status}
                  </span>
                </td>

                <td className="col-priority">
                  <span className={getPriorityClass(ticket.priority)}>
                    {ticket.priority}
                  </span>
                </td>

                <td className="col-actions">
                  <div className="icon-actions compact-actions">
                    <Link
                      to={isAdmin ? `/tickets/${ticket._id}` : `/my-tickets/${ticket._id}`}
                      className="action-btn small-action-btn"
                      title="View details"
                    >
                      View
                    </Link>

                    <button
                      type="button"
                      className="action-btn small-action-btn"
                      onClick={() => setEditingTicket && setEditingTicket(ticket)}
                      title={isAdmin ? 'Update status' : 'Edit ticket'}
                    >
                      {isAdmin ? 'Update' : 'Edit'}
                    </button>

                    <button
                      type="button"
                      className="action-btn delete-action small-action-btn"
                      onClick={() => handleDelete(ticket._id)}
                      title="Delete ticket"
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