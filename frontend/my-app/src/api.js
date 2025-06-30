import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Fixed to match backend port 8000
});

// Add token to headers if present
API.interceptors.request.use((config) => {
  // Always prefer admin token if present
  let token =
    localStorage.getItem('admin_token') ||
    sessionStorage.getItem('admin_token') ||
    localStorage.getItem('user_token') ||
    sessionStorage.getItem('user_token') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('token');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors, especially token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      console.log('Token expired or invalid, redirecting to login');
      
      // Clear all authentication data
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_user');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      sessionStorage.removeItem('admin_token');
      sessionStorage.removeItem('admin_user');
      sessionStorage.removeItem('user_token');
      sessionStorage.removeItem('user_user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API; 