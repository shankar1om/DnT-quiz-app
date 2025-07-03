import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: '', gender: '' });
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/user/signup', form);
      if (res.data.code === 201) {
        setPopup({ type: 'success', message: res.data.message || 'Registration successful! Redirecting to login...' });
        setTimeout(() => {
          setPopup(null);
          navigate('/login');
        }, 2000);
      } else {
        setPopup({ type: 'error', message: res.data.message || 'Registration failed' });
        setTimeout(() => setPopup(null), 2500);
      }
    } catch (err) {
      setPopup({ type: 'error', message: err.response?.data?.message || 'Registration failed' });
      setTimeout(() => setPopup(null), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <input name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} required className="mb-4 w-full px-3 py-2 border rounded" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="mb-4 w-full px-3 py-2 border rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="mb-4 w-full px-3 py-2 border rounded" />
        <select name="role" value={form.role} onChange={handleChange} required className="mb-4 w-full px-3 py-2 border rounded">
          <option value="" disabled>Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select name="gender" value={form.gender} onChange={handleChange} required className="mb-4 w-full px-3 py-2 border rounded">
          <option value="" disabled>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
      {popup && (
        <div className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white ${popup.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{popup.message}</div>
      )}
    </div>
  );
};

export default Signup; 