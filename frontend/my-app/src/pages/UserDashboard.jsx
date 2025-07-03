import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const QuizStatusBadge = ({ status }) => (
  <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded font-bold ${status === 'completed' ? 'bg-green-600 text-white' : 'bg-yellow-400 text-gray-800'}`}>
    {status === 'completed' ? 'Completed' : 'Pending'}
  </span>
);

const QuizCard = ({ quiz, onClick }) => (
  <div className="relative bg-white rounded-lg shadow-md p-4 cursor-pointer hover:scale-105 transition-transform duration-200 border border-blue-100" onClick={onClick}>
    <QuizStatusBadge status={quiz.status} />
    <h3 className="text-lg font-bold mb-2">{quiz.title}</h3>
    <p className="text-gray-600 mb-1">{quiz.description}</p>
    <div className="text-xs text-gray-500">Difficulty: {quiz.difficulty}</div>
    <div className="text-xs text-gray-500">Questions: {quiz.questions.length}</div>
  </div>
);

const QuizCategorySection = ({ category, quizzes, onQuizClick }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold mb-4 text-blue-700">{category.name}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {quizzes.map(quiz => (
        <QuizCard
          key={quiz._id}
          quiz={quiz}
          onClick={() => onQuizClick(quiz)}
        />
      ))}
    </div>
  </div>
);

const UserDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const navigate = useNavigate();

  // Check authentication
  const user = JSON.parse(localStorage.getItem('user_user')) || JSON.parse(sessionStorage.getItem('user_user'));
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [navigate, user]);

  const userId = user?._id;

  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const [catRes, quizRes] = await Promise.all([
      API.get('/categories'),
      API.get('/quizzes'),
    ]);
    setCategories(catRes.data.data);
    setQuizzes(quizRes.data.data);
    if (showLoading) setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  // Group quizzes by category and filter out empty categories
  const quizzesByCategory = categories
    .map(cat => ({
      ...cat,
      quizzes: quizzes.filter(q => q.category && q.category._id === cat._id)
    }))
    .filter(cat => cat.quizzes.length > 0); // Only include categories with quizzes

  const handleQuizClick = (quiz) => {
    if (quiz.status === 'completed') {
      setSelectedQuiz(quiz);
      setShowModal(true);
    } else {
      navigate(`/quiz-attempt/${quiz._id}`);
    }
  };

  const handleReattempt = () => {
    if (selectedQuiz) {
      navigate(`/quiz-attempt/${selectedQuiz._id}`);
      setShowModal(false);
      setSelectedQuiz(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedQuiz(null);
  };

  // Add refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData(false);
    setRefreshing(false);
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg py-6 px-4 mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Welcome to the User Dashboard</h1>
        <p className="text-base md:text-lg font-medium opacity-90">Here you can find and attempt the latest quizzes!</p>
      </div>
      <div className="flex justify-center mb-6">
        <button
          onClick={handleRefresh}
          className={`px-6 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60 cursor-pointer`}
          disabled={refreshing}
        >
          {refreshing ? 'Updating...' : 'Get Updated Quizzes'}
        </button>
      </div>
      {quizzesByCategory.length > 0 ? (
        quizzesByCategory.map(cat => (
          <QuizCategorySection
            key={cat._id}
            category={cat}
            quizzes={cat.quizzes}
            onQuizClick={handleQuizClick}
          />
        ))
      ) : (
        <div className="text-center text-gray-600 mt-8">
          <p className="text-lg">No quizzes available at the moment.</p>
          <p className="text-sm mt-2">Please check back later or contact an administrator.</p>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-center">You've already attempted this quiz. Do you want to take it again?</h2>
            <div className="flex justify-end gap-4">
              <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer" onClick={handleCancel}>Cancel</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer" onClick={handleReattempt}>Reattempt Quiz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard; 