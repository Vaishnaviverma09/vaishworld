import React, { useState, useEffect } from 'react';
import './PacmanLoading.css';

const PacmanLoading = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 0-11 (12 squares total)
  const [isComplete, setIsComplete] = useState(false);
  const totalSteps = 12; // 3 rounds × 4 squares

  // Each step: 375ms → 12 steps × 375ms = 4500ms (4.5 seconds total)
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= totalSteps - 1) {
          setIsComplete(true);
          clearInterval(interval);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 300);
          return prev;
        }
        return prev + 1;
      });
    }, 375);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (isComplete) {
    return null;
  }

  // Calculate Pacman position (0% to 100%)
  const pacmanProgress = (step / (totalSteps - 1)) * 100;

  return (
    <div className="pacman-loading-overlay">
      <div className="pacman-loading-container">
        <div className="pacman-track">
          {/* Pacman character that moves right */}
          <div 
            className="pacman-character"
            style={{ left: `${pacmanProgress}%` }}
          >
            <img src="/image.png" alt="Pacman" className="pacman-image" />
            <div className="pacman-mouth"></div>
          </div>

          {/* Squares that disappear as Pacman eats them */}
          <div className="pacman-squares">
            {[...Array(12)].map((_, index) => {
              const isEaten = index <= step;
              return (
                <div 
                  key={index} 
                  className={`pacman-square ${isEaten ? 'eaten' : ''}`}
                >
                  {!isEaten && <span className="square-block">■</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PacmanLoading;