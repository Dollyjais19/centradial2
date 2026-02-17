
import React, { useState, useEffect } from 'react';

interface TimerOverlayProps {
  onComplete: () => void;
  onCancel: () => void;
}

const TimerOverlay: React.FC<TimerOverlayProps> = ({ onComplete, onCancel }) => {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds === 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm fade-in">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-sm w-full mx-4">
        <div className="mb-6 relative flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              className="text-gray-100"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="44"
              cx="48"
              cy="48"
            />
            <circle
              className="text-aura-green transition-all duration-1000 ease-linear"
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - seconds / 5)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="44"
              cx="48"
              cy="48"
            />
          </svg>
          <span className="absolute text-4xl font-heading font-semibold text-aura-green">{seconds}</span>
        </div>
        <h2 className="text-xl font-heading mb-2">Mindful Pause</h2>
        <p className="text-gray-500 mb-8 leading-relaxed text-sm">
          Taking a moment to breathe helps prevent impulsive decisions. We'll proceed in a few seconds.
        </p>
        <button 
          onClick={onCancel}
          className="text-gray-400 hover:text-red-400 font-medium text-sm transition-colors"
        >
          Cancel Action
        </button>
      </div>
    </div>
  );
};

export default TimerOverlay;
