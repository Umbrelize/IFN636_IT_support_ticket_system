import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <div className="sidebar-logo">🎫</div>
          <div>
            <h2>IT Support Ticket System</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link
            to={user?.role === 'admin' ? '/admin' : '/dashboard'}
            className={location.pathname === '/dashboard' || location.pathname === '/admin' ? 'active' : ''}
          >
            Dashboard
          </Link>

          <Link
            to="/tickets"
            className={location.pathname === '/tickets' ? 'active' : ''}
          >
            My Tickets
          </Link>

          <Link
            to="/profile"
            className={location.pathname === '/profile' ? 'active' : ''}
          >
            Profile
          </Link>
        </nav>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default Navbar;