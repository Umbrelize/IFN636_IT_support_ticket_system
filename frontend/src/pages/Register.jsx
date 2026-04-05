import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../axiosConfig';

const BrandLogo = () => {
  return (
    <div className="brand-logo-svg" aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="14" width="44" height="36" rx="10" fill="currentColor" opacity="0.14" />
        <rect x="16" y="20" width="32" height="24" rx="6" stroke="currentColor" strokeWidth="3" />
        <path d="M24 28H40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M24 36H34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="43" cy="36" r="3" fill="currentColor" />
      </svg>
    </div>
  );
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page auth-page-with-header">
      <header className="auth-topbar">
        <div className="auth-topbar-brand">
          <BrandLogo />
          <div className="auth-topbar-text">IT Support Portal</div>
        </div>
      </header>

      <div className="auth-body">
        <div className="auth-card auth-card-compact">
          <div className="auth-brand auth-brand-compact">
            <BrandLogo />
            <div>
              <h1>Create account</h1>
              <p>Register for the IT Support Ticket System</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <p className="error-text">{error}</p>}

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="auth-btn">
              Register
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;