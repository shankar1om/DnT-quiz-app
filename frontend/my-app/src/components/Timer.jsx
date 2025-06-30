import React, { useEffect, useState, useRef } from 'react';

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const Timer = ({ duration, onTimeUp, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef();

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [timeLeft, onTimeUp]);

  return (
    <div className={`flex items-center justify-center px-4 py-2 rounded bg-blue-100 text-blue-800 font-bold text-lg shadow ${className}`}>
      <span role="img" aria-label="timer" className="mr-2">⏰</span>
      {formatTime(timeLeft)}
    </div>
  );
};

export default Timer; 