import { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/auth/profile');
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          university: response.data.university || '',
          address: response.data.address || '',
        });
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/api/auth/profile', formData);

      updateUser(
        {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: user?.role || response.data.role || 'user',
          university: response.data.university || '',
          address: response.data.address || '',
        },
        response.data.token
      );

      setSuccess('Profile updated successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="main-content">
      <div className="top-header">
        <div>
          <h1>Profile</h1>
          <p>Manage your account details</p>
        </div>
      </div>

      <div className="card form-card">
        {loadingProfile ? (
          <p>Loading profile...</p>
        ) : (
          <>
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <form onSubmit={handleSubmit} className="ticket-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>University</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="primary-btn">
                Update Profile
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;