import React, { useState, useEffect } from 'react';
import './PacmanLoading.css';

const PacmanLoading = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); // 0, 1, 2 = 3 rounds
  const [progress, setProgress] = useState(0); // 0-4 squares per round
  const [isComplete, setIsComplete] = useState(false);

  // Each round takes 1.5 seconds (4 squares × 0.375s each)
  // Total: 3 rounds × 1.5s = 4.5 seconds
  useEffect(() => {
    const totalDuration = 4500;
    const intervalTime = 375; // 0.375s per square (4 squares × 0.375s = 1.5s per round)
    const totalSteps = 12; // 3 rounds × 4 squares

    let step = 0;
    const interval = setInterval(() => {
      step++;
      
      // Calculate which round and which square
      const currentRound = Math.floor(step / 4);
      const currentSquare = step % 4;
      
      if (step >= totalSteps) {
        setIsComplete(true);
        clearInterval(interval);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 300);
        return;
      }
      
      setPhase(currentRound);
      setProgress(currentSquare + 1);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (isComplete) {
    return null;
  }

  // Generate squares for current round
  const squares = [];
  for (let i = 0; i < 4; i++) {
    const isEaten = i < progress;
    squares.push(
      <div key={i} className={`pacman-square ${isEaten ? 'eaten' : ''}`}>
        {isEaten ? '✧' : '■'}
      </div>
    );
  }

  return (
    <div className="pacman-loading-overlay">
      <div className="pacman-loading-container">
        <div className="pacman-loading-row">
          <div className="pacman-character">
            <img src="/ghost.png" alt="Pacman" className="pacman-image" />
            <div className="pacman-mouth"></div>
          </div>
          {squares}
        </div>
        <p className="pacman-loading-text">
          Round {phase + 1} of 3
        </p>
        <div className="pacman-progress-bar">
          <div 
            className="pacman-progress-fill" 
            style={{ width: `${((phase * 4 + progress) / 12) * 100}%` }}
          />
        </div>
        <p className="pacman-loading-subtext">Loading your maze...</p>
      </div>
    </div>
  );
};

export default PacmanLoading;