import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import UserDashboard from './pages/UserDashboard';
import QuizAttempt from './pages/QuizAttempt';
import QuizReview from './pages/QuizReview';
import QuizResult from './pages/QuizResult';
import UserProgressTracking from './pages/UserProgressTracking';
import Leaderboard from './pages/Leaderboard';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout } from './userSlice';
import { useEffect } from 'react';
import API from './api';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {
    // Check for admin authentication first
    const adminToken = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    const adminUser = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');
    
    if (adminToken && adminUser) {
      dispatch(setUser({ user: JSON.parse(adminUser), token: adminToken }));
      return;
    }

    // Check for user authentication
    const userToken = localStorage.getItem('user_token') || sessionStorage.getItem('user_token');
    const userUser = localStorage.getItem('user_user') || sessionStorage.getItem('user_user');
    
    if (userToken && userUser) {
      dispatch(setUser({ user: JSON.parse(userUser), token: userToken }));
      return;
    }

    // Legacy support for old token format
    const legacyToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const legacyUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (legacyToken && legacyUser) {
      dispatch(setUser({ user: JSON.parse(legacyUser), token: legacyToken }));
    }
  }, [dispatch]);

  // Periodic token validation (every 5 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    const validateToken = async () => {
      try {
        await API.get('/user/validate');
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('Token validation failed, logging out');
          dispatch(logout());
          window.location.href = '/login';
        }
      }
    };

    // Validate immediately
    validateToken();

    // Set up periodic validation every 5 minutes
    const interval = setInterval(validateToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/quiz-attempt/:quizId" element={<QuizAttempt />} />
          <Route path="/quiz-review/:quizId" element={<QuizReview />} />
          <Route path="/quiz-result/:resultId" element={<QuizResult />} />
          <Route path="/user/progress-tracking" element={<UserProgressTracking />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
