import React, { useEffect, useState } from 'react';
import API from '../api';
import QuestionForm from '../components/QuestionForm';

const QuizQuestionsModal = ({ quiz, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editQuestion, setEditQuestion] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Fetch questions for the quiz
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/quizzes/${quiz._id}`);
      setQuestions(res.data.quiz.questions || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quiz) {
      fetchQuestions();
    }
  }, [quiz]);

  const handleEditSave = async (updatedQuestion) => {
    setEditLoading(true);
    try {
      await API.put(`/questions/${updatedQuestion._id}`, updatedQuestion);
      // Refresh questions
      await fetchQuestions();
      setEditQuestion(null);
    } finally {
      setEditLoading(false);
    }
  };

  if (!quiz) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-8 w-full max-w-2xl relative animate-fadeIn max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-center">Questions for: {quiz.title}</h2>
        {loading ? (
          <div>Loading questions...</div>
        ) : (
          <div className="mb-4">
            {questions.length === 0 ? (
              <div className="text-gray-500">No questions added yet.</div>
            ) : (
              <ul className="space-y-2">
                {questions.map((q, idx) => (
                  <li key={q._id || idx} className="border rounded p-2">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">Q{idx + 1}: {q.text}</div>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors duration-200 shadow-sm ml-2"
                        onClick={() => setEditQuestion(q)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m2 2H7a2 2 0 01-2-2v-4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2z" /></svg>
                        Edit
                      </button>
                    </div>
                    {q.type === 'mcq' && (
                      <ul className="ml-4 list-disc">
                        {q.options.map((opt, i) => (
                          <li key={i} className={opt.isCorrect ? 'text-green-600 font-bold' : ''}>{opt.text}</li>
                        ))}
                      </ul>
                    )}
                    {q.type === 'truefalse' && (
                      <div className="ml-4">Correct Answer: <span className="font-bold">{q.correctAnswer}</span></div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <QuestionForm quizId={quiz._id} onClose={onClose} onQuestionAdded={fetchQuestions} />
        {editQuestion && (
          <EditQuestionModal
            question={editQuestion}
            onClose={() => setEditQuestion(null)}
            onSave={handleEditSave}
            loading={editLoading}
          />
        )}
      </div>
    </div>
  );
};

const EditQuestionModal = ({ question, onClose, onSave, loading }) => {
  const [form, setForm] = useState({ ...question });

  const handleOptionChange = (idx, value) => {
    const newOptions = [...form.options];
    newOptions[idx].text = value;
    setForm({ ...form, options: newOptions });
  };

  const handleCorrectChange = (idx, checked) => {
    const newOptions = form.options.map((o, i) =>
      i === idx ? { ...o, isCorrect: checked } : o
    );
    setForm({ ...form, options: newOptions });
  };

  const handleAddOption = () => {
    setForm({ ...form, options: [...form.options, { text: '', isCorrect: false }] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-8 w-full max-w-lg relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">&times;</button>
        <h2 className="text-xl font-bold mb-4 text-center">Edit Question</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="mb-2 w-full border p-2 rounded"
            placeholder="Question Text"
            value={form.text}
            onChange={e => setForm({ ...form, text: e.target.value })}
            required
          />
          <select
            className="mb-2 w-full border p-2 rounded"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            <option value="mcq">Multiple Choice</option>
            <option value="truefalse">True/False</option>
          </select>
          {form.type === 'mcq' && (
            <>
              {form.options.map((opt, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    className="flex-1 border p-2 rounded"
                    placeholder={`Option ${idx + 1}`}
                    value={opt.text}
                    onChange={e => handleOptionChange(idx, e.target.value)}
                    required
                  />
                  <input
                    type="checkbox"
                    className="accent-blue-500 w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all duration-150"
                    checked={opt.isCorrect}
                    onChange={e => handleCorrectChange(idx, e.target.checked)}
                  />
                  <span className="ml-1 text-xs">Correct</span>
                </div>
              ))}
              <button type="button" className="bg-gray-300 px-2 py-1 rounded" onClick={handleAddOption}>
                Add Option
              </button>
            </>
          )}
          {form.type === 'truefalse' && (
            <select
              className="mb-2 w-full border p-2 rounded"
              value={form.correctAnswer}
              onChange={e => setForm({ ...form, correctAnswer: e.target.value })}
            >
              <option value="">Select Correct Answer</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          )}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2" disabled={loading}>
            {loading ? 'Updating...' : 'Update Question'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'easy',
    timeLimit: 60,
    shuffleOptions: false,
  });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [modalQuiz, setModalQuiz] = useState(null);

  // Fetch quizzes and categories
  useEffect(() => {
    API.get('/quizzes').then(res => setQuizzes(res.data.quizzes));
    API.get('/categories').then(res => setCategories(res.data.categories));
  }, []);

  // Filter quizzes by category
  const filteredQuizzes = selectedCategory
    ? quizzes.filter(q => q.category?._id === selectedCategory)
    : quizzes;

  // Handle quiz creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post('/quizzes', form);
    setQuizzes([res.data.quiz, ...quizzes]);
    setForm({
      title: '',
      description: '',
      category: '',
      difficulty: 'easy',
      timeLimit: 60,
      shuffleOptions: false,
    });
  };

  // Handle category creation
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const res = await API.post('/categories', categoryForm);
    setCategories([res.data.category, ...categories]);
    setCategoryForm({ name: '', description: '' });
  };

  // Handle quiz deletion
  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      await API.delete(`/quizzes/${quizId}`);
      setQuizzes(quizzes.filter(q => q._id !== quizId));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl shadow-lg py-6 px-4 mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Welcome to the Admin Dashboard</h1>
            <p className="text-base md:text-lg font-medium opacity-90">Manage quizzes, questions, and categories here.</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side: Category and Quiz Creation Forms */}
        <div className="flex-1">
          {/* Category Creation Form */}
          <form onSubmit={handleCategorySubmit} className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-lg font-bold mb-2">Add Category</h2>
            <input
              className="mb-2 w-full border p-2 rounded"
              placeholder="Category Name"
              value={categoryForm.name}
              onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
              required
            />
            <input
              className="mb-2 w-full border p-2 rounded"
              placeholder="Description (optional)"
              value={categoryForm.description}
              onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mt-2">
              Add Category
            </button>
          </form>
          {/* Quiz Creation Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Create New Quiz</h2>
            <input
              className="mb-2 w-full border p-2 rounded"
              placeholder="Quiz Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              className="mb-2 w-full border p-2 rounded"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <select
              className="mb-2 w-full border p-2 rounded"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <select
              className="mb-2 w-full border p-2 rounded"
              value={form.difficulty}
              onChange={e => setForm({ ...form, difficulty: e.target.value })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <input
              className="mb-2 w-full border p-2 rounded"
              type="number"
              min="10"
              placeholder="Time Limit (seconds)"
              value={form.timeLimit}
              onChange={e => setForm({ ...form, timeLimit: e.target.value })}
            />
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={form.shuffleOptions}
                onChange={e => setForm({ ...form, shuffleOptions: e.target.checked })}
              />
              <span className="ml-2">Shuffle Answer Options</span>
            </label>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
              Create Quiz
            </button>
          </form>
        </div>
        {/* Quiz List and Category Filter */}
        <div className="flex-1">
          <div className="mb-4 flex gap-2">
            <button
              className={`px-3 py-1 rounded ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                className={`px-3 py-1 rounded ${selectedCategory === cat._id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setSelectedCategory(cat._id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <h2 className="text-xl font-bold mb-4">Existing Quizzes</h2>
          <div className="space-y-4">
            {filteredQuizzes.map(quiz => (
              <div key={quiz._id} className="bg-gray-100 p-4 rounded shadow flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="font-semibold cursor-pointer" style={{ cursor: 'pointer' }} onClick={() => setModalQuiz(quiz)}>{quiz.title}</div>
                  <div className="text-sm text-gray-600">{quiz.category?.name || 'Uncategorized'}</div>
                  <div className="text-xs text-gray-500">Difficulty: {quiz.difficulty}</div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer" style={{ cursor: 'pointer' }} onClick={() => setModalQuiz(quiz)}>View Questions</button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer" style={{ cursor: 'pointer' }} onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {modalQuiz && <QuizQuestionsModal quiz={modalQuiz} onClose={() => setModalQuiz(null)} />}
    </div>
  );
};

export default AdminDashboard;

<style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} } .animate-fadeIn { animation: fadeIn 0.2s ease; }`}</style> 