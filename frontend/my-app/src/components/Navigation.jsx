import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../userSlice';
import UpdateProfileModal from './UpdateProfileModal';

const Navigation = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
console.log(user)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const avatarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/login');
  };

  const handleUpdate = () => {
    setDropdownOpen(false);
    setShowUpdateModal(true);
  };

  return (
    <>
      <nav className="bg-white shadow mb-6">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600">Quiz App</div>
          <div className="space-x-4 flex items-center">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/signup" className="text-gray-700 hover:text-blue-600">Sign Up</Link>
              </>
            ) : (
              <>
                {/* Role-based dashboard links */}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-purple-700 font-semibold">Admin Dashboard</Link>
                )}
                {user?.role === 'user' && (
                  <Link to="/user-dashboard" className="text-gray-700 hover:text-blue-700 font-semibold">User Dashboard</Link>
                )}
                <Link to="/leaderboard" className="text-gray-700 hover:text-blue-600">Leaderboard</Link>
                {user?.role === 'user' && (
                  <Link to="/user/progress-tracking" className="text-gray-700 hover:text-blue-600">Progress Tracking</Link>
                )}
                <div className="relative" ref={avatarRef}>
                  <button
                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center focus:outline-none cursor-pointer"
                    onClick={() => setDropdownOpen((open) => !open)}
                  >
                    <span className="text-lg font-bold text-blue-600">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                      <button
                        onClick={handleUpdate}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Update Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      <UpdateProfileModal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} />
    </>
  );
};

export default Navigation; 