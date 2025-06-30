import { createSlice } from '@reduxjs/toolkit';

// Helper function to get the appropriate token and user from storage
const getStoredAuth = () => {
  // Check for admin authentication first
  const adminToken = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
  const adminUser = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');
  
  if (adminToken && adminUser) {
    return { token: adminToken, user: JSON.parse(adminUser) };
  }

  // Check for user authentication
  const userToken = localStorage.getItem('user_token') || sessionStorage.getItem('user_token');
  const userUser = localStorage.getItem('user_user') || sessionStorage.getItem('user_user');
  
  if (userToken && userUser) {
    return { token: userToken, user: JSON.parse(userUser) };
  }

  // Legacy support
  const legacyToken = localStorage.getItem('token') || sessionStorage.getItem('token');
  const legacyUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  
  if (legacyToken && legacyUser) {
    return { token: legacyToken, user: JSON.parse(legacyUser) };
  }

  return { token: null, user: null };
};

const { token, user } = getStoredAuth();

const initialState = {
  user: user,
  token: token,
  isAuthenticated: !!user && !!token,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear all possible storage locations
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
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { setUser, logout, updateUser } = userSlice.actions;
export default userSlice.reducer; 