import React, { useEffect, useState } from 'react';
import API from '../api';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

Chart.register(ArcElement, Tooltip, Legend);

const getColor = (percent) => {
  if (percent < 30) return '#ef4444'; // red
  if (percent < 60) return '#facc15'; // yellow
  return '#22c55e'; // green
};

const EMOJIS = ['✨', '🎯', '🚀', '🧠', '🏆', '🌟'];

const UserProgressTracking = () => {
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emoji, setEmoji] = useState('✨');

  // Get user name
  const user = JSON.parse(localStorage.getItem('user_user')) || JSON.parse(sessionStorage.getItem('user_user'));
  const userName = user?.username || 'User';

  useEffect(() => {
    setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    const fetchData = async () => {
      setLoading(true);
      const [catRes, quizRes] = await Promise.all([
        API.get('/categories'),
        API.get('/quizzes'),
      ]);
      setCategories(catRes.data.categories);
      setQuizzes(quizRes.data.quizzes);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Group quizzes by category
  const progressByCategory = categories.map(cat => {
    const catQuizzes = quizzes.filter(q => q.category && q.category._id === cat._id);
    const completed = catQuizzes.filter(q => q.status === 'completed').length;
    const total = catQuizzes.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    return { ...cat, completed, total, percent };
  }).filter(cat => cat.total > 0);

  // Overall progress
  const totalCompleted = quizzes.filter(q => q.status === 'completed').length;
  const totalQuizzes = quizzes.length;
  const overallPercent = totalQuizzes ? Math.round((totalCompleted / totalQuizzes) * 100) : 0;
  const overallColor = getColor(overallPercent);

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]">Loading progress...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Personalized Animated Heading */}
      <motion.h2
        className="text-2xl md:text-3xl font-extrabold text-center mb-4 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="inline-block">
          <span className="text-blue-700">Your Quiz Journey, </span>
          <motion.span
            className="text-pink-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {userName}
          </motion.span>
          <motion.span
            className="ml-2 text-2xl md:text-3xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200 }}
          >
            {emoji}
          </motion.span>
        </span>
      </motion.h2>
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-blue-800"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Progress Tracking
      </motion.h1>
      {/* Overall Progress */}
      <motion.div
        className="flex flex-col items-center mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <span className="text-lg text-gray-700 mb-2">Overall Progress</span>
        <span className="text-4xl font-extrabold mb-2" style={{ color: overallColor }}>{overallPercent}%</span>
        <div className="w-full max-w-md h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-4 rounded-full transition-all duration-700"
            style={{ width: `${overallPercent}%`, background: overallColor }}
          />
        </div>
        <div className="text-sm text-gray-500 mt-2">{totalCompleted} of {totalQuizzes} quizzes completed</div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {progressByCategory.map(cat => (
          <motion.div
            key={cat._id}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold mb-4 text-blue-700">{cat.name}</h2>
            <div className="w-40 h-40 mb-4 relative flex items-center justify-center">
              <Doughnut
                data={{
                  labels: ['Completed', 'Remaining'],
                  datasets: [
                    {
                      data: [cat.completed, cat.total - cat.completed],
                      backgroundColor: [getColor(cat.percent), '#e5e7eb'],
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  cutout: '70%',
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                  animation: {
                    animateRotate: true,
                    duration: 1200,
                  },
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span className="text-2xl font-extrabold" style={{ color: getColor(cat.percent) }}>{cat.percent}%</span>
              </div>
            </div>
            <div className="text-gray-600 mt-2 text-center">
              {cat.completed} of {cat.total} quizzes completed
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserProgressTracking; 