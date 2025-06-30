import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/signup');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to the Quiz App!</h1>
      <p className="text-lg text-gray-700">Get ready to test your knowledge. Redirecting to sign up...</p>
    </div>
  );
};

export default Home; 