import axios from 'axios';

// Change this one value when your EC2 public IP changes
export const BACKEND_BASE_URL = 'http://3.107.187.143';

// API base URL for axios requests
export const API_BASE_URL = `${BACKEND_BASE_URL}/api`;

// Optional helper for uploaded images
export const UPLOADS_BASE_URL = `${BACKEND_BASE_URL}/uploads`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;