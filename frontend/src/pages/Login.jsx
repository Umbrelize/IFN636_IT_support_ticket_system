import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login(formData);
      console.log("LOGIN RESPONSE:", data);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
    console.log("ERROR:", error.response?.data);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>

        <p className="text-center mt-4">
          No account? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;