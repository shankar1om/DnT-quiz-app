import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { motion } from 'framer-motion';
import Timer from '../components/Timer';

const QuizAttempt = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionId: selectedValue }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // for forcing Timer re-render
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/quizzes/${quizId}`);
        const quizData = res.data.data;
        
        // Check if quiz has questions
        if (!quizData.questions || quizData.questions.length === 0) {
          setError('no-questions');
        } else {
          setQuiz(quizData);
          // Timer persistence logic
          if (quizData.timeLimit) {
            const key = `quiz-timer-${quizId}`;
            let startTime = localStorage.getItem(key);
            const now = Date.now();
            if (!startTime) {
              startTime = now;
              localStorage.setItem(key, startTime);
            }
            const elapsed = Math.floor((now - startTime) / 1000);
            const rem = Math.max(quizData.timeLimit - elapsed, 0);
            setRemaining(rem);
            setTimerKey(prev => prev + 1); // force Timer re-render
          }
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError('not-found');
        } else {
          setError('fetch-error');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleSelect = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleReview = () => {
    // Pass quiz, answers to review page
    navigate(`/quiz-review/${quizId}`, { state: { quiz, answers } });
  };

  const handleGoBack = () => {
    navigate('/user-dashboard');
  };

  // Calculate progress
  const totalQuestions = quiz?.questions?.length || 0;
  const answeredCount = Object.keys(answers).filter(key => answers[key]).length;
  const progress = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;

  // Timer auto-submit logic
  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const answerArr = quiz.questions.map(q => ({
        question: q._id,
        selected: answers[q._id] || ''
      }));
      const userObj = JSON.parse(localStorage.getItem('user_user')) || JSON.parse(sessionStorage.getItem('user_user'));
      const userId = userObj?._id || userObj?.id;
      const res = await API.post('/results', {
        user: userId,
        quiz: quiz._id,
        answers: answerArr
      });
      // Remove timer from localStorage on submit
      localStorage.removeItem(`quiz-timer-${quizId}`);
      navigate(`/quiz-result/${res.data.data._id}`, { state: { result: res.data.data, quiz, autoSubmitted: true } });
    } catch (err) {
      alert('Error submitting quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    if (submitting) return;
    localStorage.removeItem(`quiz-timer-${quizId}`);
    submitQuiz();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error === 'not-found') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4 text-red-600">Quiz Not Found</h1>
          <p className="text-gray-600 mb-6">The quiz you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={handleGoBack}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (error === 'no-questions') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <div className="text-yellow-500 text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold mb-4 text-yellow-600">No Questions Available</h1>
          <p className="text-gray-600 mb-6">Currently no questions are available in this quiz. Please check back later or contact an administrator.</p>
          <button 
            onClick={handleGoBack}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (error === 'fetch-error') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Quiz</h1>
          <p className="text-gray-600 mb-6">There was an error loading the quiz. Please try again later.</p>
          <button 
            onClick={handleGoBack}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❓</div>
          <h1 className="text-2xl font-bold mb-4 text-red-600">Quiz Not Found</h1>
          <p className="text-gray-600 mb-6">Unable to load the quiz. Please try again.</p>
          <button 
            onClick={handleGoBack}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl relative">
      {/* Timer at top-right */}
      {quiz.timeLimit && remaining !== null && (
        <div className="absolute right-4 top-4 z-10">
          <Timer key={timerKey} duration={remaining} onTimeUp={handleTimeUp} />
        </div>
      )}
      <h1 className="text-2xl font-bold mb-6 text-blue-800">{quiz.title}</h1>
      {/* Animated Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 h-4 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <form onSubmit={e => { e.preventDefault(); handleReview(); }}>
        {quiz.questions.map((q, idx) => (
          <motion.div
            key={q._id}
            className="mb-6 p-4 bg-white rounded shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="font-semibold mb-2">Q{idx + 1}: {q.text}</div>
            {q.type === 'mcq' && (
              <div className="flex flex-col gap-2">
                {q.options.map((opt, i) => (
                  <label key={i} className={`flex items-center p-2 rounded cursor-pointer border ${answers[q._id] === opt.text ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name={`q_${q._id}`}
                      value={opt.text}
                      checked={answers[q._id] === opt.text}
                      onChange={() => handleSelect(q._id, opt.text)}
                      className="mr-2"
                    />
                    {opt.text}
                  </label>
                ))}
              </div>
            )}
            {q.type === 'truefalse' && (
              <div className="flex gap-4">
                <label className={`flex items-center p-2 rounded cursor-pointer border ${answers[q._id] === 'true' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name={`q_${q._id}`}
                    value="true"
                    checked={answers[q._id] === 'true'}
                    onChange={() => handleSelect(q._id, 'true')}
                    className="mr-2"
                  />
                  True
                </label>
                <label className={`flex items-center p-2 rounded cursor-pointer border ${answers[q._id] === 'false' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name={`q_${q._id}`}
                    value="false"
                    checked={answers[q._id] === 'false'}
                    onChange={() => handleSelect(q._id, 'false')}
                    className="mr-2"
                  />
                  False
                </label>
              </div>
            )}
          </motion.div>
        ))}
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2 rounded font-bold hover:scale-105 hover:shadow-lg transition-all duration-300 mt-4">
          Review Answers
        </button>
      </form>
    </div>
  );
};

export default QuizAttempt; 