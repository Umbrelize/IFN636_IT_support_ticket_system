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
        const response = await api.get('/auth/profile');
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
      const response = await api.put('/auth/profile', formData);

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

  if (loadingProfile) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p className="empty-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>Profile</h1>
        <p>Manage your account details</p>

        {error && <p className="error-text">{error}</p>}

        {success && (
          <p
            style={{
              margin: '0 0 16px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: '#edfdf3',
              border: '1px solid #b7ebc8',
              color: '#1f8f4d',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
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
            />
          </div>

          <div className="form-group">
            <label>University</label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder="Enter your university"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>

          <button type="submit" className="primary-btn">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;