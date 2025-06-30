import React, { useEffect, useState } from 'react';
import API from '../api';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const RANK_EMOJIS = ['🥇', '🥈', '🥉'];
const BAR_COLORS = [
  'rgba(255, 215, 0, 0.8)', // gold
  'rgba(192, 192, 192, 0.8)', // silver
  'rgba(205, 127, 50, 0.8)', // bronze
  'rgba(59, 130, 246, 0.7)', // blue
  'rgba(34, 197, 94, 0.7)', // green
  'rgba(251, 191, 36, 0.7)', // yellow
  'rgba(244, 63, 94, 0.7)', // red
  'rgba(139, 92, 246, 0.7)', // purple
  'rgba(16, 185, 129, 0.7)', // teal
  'rgba(251, 146, 60, 0.7)', // orange
];

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: loggedInUser } = useSelector(state => state.user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await API.get('/results/leaderboard');
      setLeaderboard(res.data.leaderboard || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Sort by percent desc, then by username
  const sorted = [...leaderboard].sort((a, b) => b.percent - a.percent || a.username.localeCompare(b.username));
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  // Pagination for rest
  const [page, setPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(rest.length / perPage);
  const paginated = rest.slice((page - 1) * perPage, page * perPage);

  // Chart.js data
  const chartData = {
    labels: top3.map((u, i) => `${u.username}`),
    datasets: [
      {
        label: 'Progress %',
        data: top3.map(u => u.percent),
        backgroundColor: top3.map((_, i) => BAR_COLORS[i] || BAR_COLORS[BAR_COLORS.length - 1]),
        borderRadius: 8,
        maxBarThickness: 40,
        minBarLength: 2, // ensure bar is visible even for 0%
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    animation: {
      duration: 1200,
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { weight: 'bold' } },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: '#e5e7eb' },
        ticks: { stepSize: 20, callback: v => v + '%' },
        min: 0,
        suggestedMax: 100,
      },
    },
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]">Loading leaderboard...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-blue-800"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Leaderboard
      </motion.h1>
      {/* Top 3 Users */}
      <div className="flex flex-col md:flex-row gap-6 mb-10 justify-center items-center">
        {top3.map((u, i) => (
          <div
            key={u._id}
            className={`flex flex-col items-center bg-white rounded-xl shadow-lg px-8 py-6 w-full md:w-1/3 border-2 ${i === 0 ? 'border-yellow-400' : i === 1 ? 'border-gray-400' : 'border-amber-700'}`}
          >
            <span className="text-4xl mb-2">{RANK_EMOJIS[i]}</span>
            <span className="text-lg font-bold text-blue-700 mb-1">{u.username}</span>
            <span className="text-sm text-gray-500 mb-1">Rank {i + 1}</span>
            <span className="text-2xl font-extrabold" style={{ color: BAR_COLORS[i] }}>{u.percent}%</span>
          </div>
        ))}
      </div>
      {/* Paginated List for Rest */}
      {rest.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 max-h-[500px] border border-gray-200">
          <h2 className="text-lg font-bold mb-4 text-blue-700">Other Users</h2>
          <ul className="divide-y divide-gray-100">
            {paginated.map((u, i) => {
              const rank = 4 + (page - 1) * perPage + i;
              const isCurrent = loggedInUser && (u._id === loggedInUser._id);
              return (
                <li
                  key={u._id}
                  className={`py-3 flex items-center justify-between rounded ${isCurrent ? 'bg-blue-50 font-bold' : ''}`}
                >
                  <span className="font-semibold text-gray-700 flex items-center">
                    {rank}. {u.username}
                    {isCurrent && <span className="ml-2 px-2 py-0.5 rounded bg-blue-200 text-blue-800 text-xs font-bold">👤 You</span>}
                  </span>
                  <span className="font-bold" style={{ color: '#64748b' }}>{u.percent}%</span>
                </li>
              );
            })}
          </ul>
          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                className={`px-3 py-1 rounded ${page === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard; 