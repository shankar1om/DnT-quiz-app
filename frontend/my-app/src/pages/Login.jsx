import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../userSlice';
import API from '../api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Auto-login if Remember Me was checked and user/token exist in localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch(setUser({ user: JSON.parse(user), token }));
      navigate('/profile');
    }
  }, [dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/user/login', {
        email: form.email,
        password: form.password,
      });
      console.log('Login response:', res.data); // Debug log
      if (form.remember) {
        if (res.data.user.role === 'admin') {
          localStorage.setItem('admin_token', res.data.token);
          localStorage.setItem('admin_user', JSON.stringify(res.data.user));
        } else {
          localStorage.setItem('user_token', res.data.token);
          localStorage.setItem('user_user', JSON.stringify(res.data.user));
        }
      } else {
        if (res.data.user.role === 'admin') {
          sessionStorage.setItem('admin_token', res.data.token);
          sessionStorage.setItem('admin_user', JSON.stringify(res.data.user));
        } else {
          sessionStorage.setItem('user_token', res.data.token);
          sessionStorage.setItem('user_user', JSON.stringify(res.data.user));
        }
      }
      dispatch(setUser({ user: res.data.user, token: res.data.token }));
      setPopup({ type: 'success', message: 'Login successful! Redirecting...' });
      setTimeout(() => {
        setPopup(null);
        console.log('Navigating to:', res.data.user.role === 'admin' ? '/admin' : '/user-dashboard'); // Debug log
        if (res.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user-dashboard');
        }
      }, 2000);
    } catch (err) {
      console.log('Login error:', err); // Debug log
      setPopup({ type: 'error', message: err.response?.data?.message || 'Login failed' });
      setTimeout(() => setPopup(null), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input name="email" type="text" placeholder="Email or Username" value={form.email} onChange={handleChange} required className="mb-4 w-full px-3 py-2 border rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="mb-4 w-full px-3 py-2 border rounded" />
        <div className="flex items-center mb-4">
          <input name="remember" type="checkbox" checked={form.remember} onChange={handleChange} className="mr-2" />
          <label htmlFor="remember">Remember Me</label>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      {popup && (
        <div className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white ${popup.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{popup.message}</div>
      )}
    </div>
  );
};

export default Login; 