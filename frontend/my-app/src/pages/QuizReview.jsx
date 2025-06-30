import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import API from '../api';

const QuizReview = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const quiz = location.state?.quiz;
  const [answers, setAnswers] = useState(location.state?.answers || {});
  const [submitting, setSubmitting] = useState(false);

  const userObj = JSON.parse(localStorage.getItem('user_user')) || JSON.parse(sessionStorage.getItem('user_user'));
  const userId = userObj?._id || userObj?.id;
  console.log(userId)

  if (!quiz) return <div className="text-center mt-8 text-red-500">Quiz data not found. Please start from the dashboard.</div>;

  const handleSelect = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answerArr = quiz.questions.map(q => ({
        question: q._id,
        selected: answers[q._id] || ''
      }));
      const res = await API.post('/results', {
        user: userId,
        quiz: quiz._id,
        answers: answerArr
      });
      navigate(`/quiz-result/${res.data.result._id}`, { state: { result: res.data.result, quiz } });
    } catch (err) {
      alert('Error submitting quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">Review Your Answers</h1>
      {quiz.questions.map((q, idx) => (
        <div key={q._id} className="mb-6 p-4 bg-white rounded shadow">
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
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition-colors mt-4 disabled:opacity-60"
      >
        {submitting ? 'Submitting...' : 'Submit Quiz'}
      </button>
    </div>
  );
};

export default QuizReview; 