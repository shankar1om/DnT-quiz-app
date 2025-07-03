import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API from '../api';
import { motion, useAnimation } from 'framer-motion';
import Confetti from 'react-confetti';
// Optionally, you can use a confetti library like react-confetti for more effect

const ScoreBar = ({ correct, total }) => {
  const percent = total ? (correct / total) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-6 mb-4 overflow-hidden">
      <div
        className="bg-green-500 h-6 rounded-full transition-all duration-700"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

const AnimatedPercentage = ({ percent }) => {
  // Color logic
  let color = '#22c55e'; // green
  if (percent < 30) color = '#ef4444'; // red
  else if (percent < 60) color = '#facc15'; // yellow

  // Animation
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();
    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(percent * progress));
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [percent]);

  // Circular progress
  const radius = 56;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (display / 100) * circumference;

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative flex items-center justify-center mx-auto" style={{ width: radius * 2, height: radius * 2 }}>
        <svg height={radius * 2} width={radius * 2} style={{ display: 'block' }}>
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <motion.circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-2xl md:text-3xl font-extrabold" style={{ color }}>{display}%</span>
        </div>
      </div>
      <div className="text-sm text-gray-500 mt-2">Score</div>
    </div>
  );
};

const QuizResult = () => {
  const { resultId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(location.state?.result || null);
  const [quiz, setQuiz] = useState(location.state?.quiz || null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [loading, setLoading] = useState(!result);
  // Get window size for confetti
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const percent = result.attemptedCount ? (result.correctCount / result.attemptedCount) * 100 : 0;

  useEffect(() => {
    const fetchResult = async () => {
      if (!result || !quiz) {
        setLoading(true);
        const res = await API.get(`/results/${resultId}`);
        setResult(res.data.data);
        setQuiz(res.data.data.quiz); // quiz is populated in backend
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId, result, quiz]);

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]">Loading result...</div>;
  if (!result || !quiz) return <div className="text-center mt-8 text-red-500">Result not found.</div>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <Confetti width={dimensions.width} height={dimensions.height} numberOfPieces={250} recycle={false} />
      <motion.div
        className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-8 w-full max-w-lg relative animate-fadeIn"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Quiz Result</h2>
        <AnimatedPercentage percent={percent} />
        <ScoreBar correct={result.correctCount} total={result.attemptedCount} />
        <div className="flex justify-between mb-4">
          <div className="font-semibold">Attempted: <span className="text-blue-700">{result.attemptedCount}</span></div>
          <div className="font-semibold">Correct: <span className="text-green-600">{result.correctCount}</span></div>
          <div className="font-semibold">Wrong: <span className="text-red-500">{result.wrongCount}</span></div>
        </div>
        <div className="flex flex-col items-center gap-2 mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            onClick={() => setShowAnswers(a => !a)}
          >
            {showAnswers ? 'Hide Answers' : 'View Correct Answers'}
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            onClick={() => navigate('/user-dashboard', { replace: true })}
          >
            Back to Dashboard
          </button>
        </div>
        {showAnswers && (
          <div className="mt-4 max-h-80 overflow-y-auto border-t pt-4">
            <h3 className="text-lg font-bold mb-2">Review Answers</h3>
            {result.answers.map((ans, idx) => {
              const q = quiz.questions.find(qq => qq._id === ans.question || qq._id === ans.question._id);
              return (
                <div key={ans.question} className="mb-4">
                  <div className="font-semibold">Q{idx + 1}: {q?.text}</div>
                  <div>Your Answer: <span className={ans.isCorrect ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>{ans.selected || 'Not answered'}</span></div>
                  {q?.type === 'mcq' && (
                    <div>Correct Answer: <span className="text-green-700 font-bold">{q.options.find(opt => opt.isCorrect)?.text}</span></div>
                  )}
                  {q?.type === 'truefalse' && (
                    <div>Correct Answer: <span className="text-green-700 font-bold">{q.correctAnswer}</span></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default QuizResult; 