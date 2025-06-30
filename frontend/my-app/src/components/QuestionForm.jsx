import React, { useState } from 'react';
import API from '../api';

const getInitialQuestion = () => ({
  type: 'mcq',
  text: '',
  options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
  correctAnswer: '',
  media: '',
  difficulty: 'easy',
  shuffleOptions: false,
});

const QuestionForm = ({ quizId, onClose, onQuestionAdded }) => {
  const [question, setQuestion] = useState(getInitialQuestion());

  const resetForm = () => {
    setQuestion(getInitialQuestion());
  };

  const handleOptionChange = (idx, value) => {
    const newOptions = [...question.options];
    newOptions[idx].text = value;
    setQuestion({ ...question, options: newOptions });
  };

  const handleAddOption = () => {
    setQuestion({ ...question, options: [...question.options, { text: '', isCorrect: false }] });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setQuestion({
      ...question,
      type: newType,
      // Reset options when switching to MCQ
      options: newType === 'mcq' ? [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] : [],
      // Reset correctAnswer when switching to True/False
      correctAnswer: newType === 'truefalse' ? '' : question.correctAnswer
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/questions/${quizId}`, question);
      resetForm();
      if (onQuestionAdded) onQuestionAdded();
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mt-4 max-h-[80vh] overflow-y-auto flex flex-col gap-2">
      <h3 className="font-bold mb-2">Add Question</h3>
      <input
        className="mb-2 w-full border p-2 rounded"
        placeholder="Question Text"
        value={question.text}
        onChange={e => setQuestion({ ...question, text: e.target.value })}
        required
      />
      <select
        className="mb-2 w-full border p-2 rounded"
        value={question.type}
        onChange={handleTypeChange}
      >
        <option value="mcq">Multiple Choice</option>
        <option value="truefalse">True/False</option>
      </select>
      {question.type === 'mcq' && (
        <>
          {question.options.map((opt, idx) => (
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
                className="ml-2"
                checked={opt.isCorrect}
                onChange={e => {
                  const newOptions = question.options.map((o, i) =>
                    i === idx ? { ...o, isCorrect: e.target.checked } : o
                  );
                  setQuestion({ ...question, options: newOptions });
                }}
              />
              <span className="ml-1 text-xs">Correct</span>
            </div>
          ))}
          <button type="button" className="bg-gray-300 px-2 py-1 rounded" onClick={handleAddOption}>
            Add Option
          </button>
          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              className="accent-blue-500 w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all duration-150 mr-2"
              checked={question.shuffleOptions}
              onChange={e => setQuestion({ ...question, shuffleOptions: e.target.checked })}
            />
            <span className="text-sm">Shuffle Answer Options</span>
          </label>
        </>
      )}
      {question.type === 'truefalse' && (
        <select
          className="mb-2 w-full border p-2 rounded"
          value={question.correctAnswer}
          onChange={e => setQuestion({ ...question, correctAnswer: e.target.value })}
        >
          <option value="">Select Correct Answer</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      )}
      {/* Media upload and difficulty can be added here */}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
        Add Question
      </button>
      {onClose && (
        <button type="button" className="ml-2 text-red-600" onClick={onClose}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default QuestionForm; 