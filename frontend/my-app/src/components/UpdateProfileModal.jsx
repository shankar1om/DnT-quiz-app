import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../userSlice';
import API from '../api';

const UpdateProfileModal = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    gender: user?.gender || '',
  });
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        password: '',
        gender: user.gender || '',
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = { ...form };
      if (!updateData.password) delete updateData.password;
      const res = await API.put('/user/profile', updateData);
      dispatch(updateUser(res.data.user));
      setPopup({ type: 'success', message: 'Profile updated successfully!' });
      setTimeout(() => {
        setPopup(null);
        onClose();
      }, 1500);
    } catch (err) {
      setPopup({ type: 'error', message: err.response?.data?.message || 'Profile update failed' });
      setTimeout(() => setPopup(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <input name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} required className="mb-4 w-full px-3 py-2 border rounded" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="mb-4 w-full px-3 py-2 border rounded" />
          <input name="password" type="password" placeholder="New Password" value={form.password} onChange={handleChange} className="mb-4 w-full px-3 py-2 border rounded" />
          <select name="gender" value={form.gender} onChange={handleChange} required className="mb-4 w-full px-3 py-2 border rounded">
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>{loading ? 'Updating...' : 'Update Profile'}</button>
        </form>
        {popup && (
          <div className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white ${popup.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{popup.message}</div>
        )}
      </div>
    </div>
  );
};

export default UpdateProfileModal; 