import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.user);

  if (!user) return null;

  return (
    <div>
      
    </div>
  );
};

export default Profile; 