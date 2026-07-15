import React, { useState, useEffect, useCallback } from 'react';  // ← ADD useCallback
import { motion, useMotionValue, useMotionValueEvent } from 'framer-motion';
import './ShuffleLoading.css';

const CARD_OFFSET_PERCENTAGE = 8;
const ROTATION_DEGREE = 3;
const AUTO_SHUFFLE_INTERVAL_MS = 800;
const SHUFFLE_THRESHOLD = -50;

const ShuffleLoading = ({ onComplete }) => {
  const [order, setOrder] = useState([0, 1, 2, 3, 4]);
  const [dragging, setDragging] = useState(false);
  const dragProgress = useMotionValue(0);
  const [isComplete, setIsComplete] = useState(false);

  const shuffleOrder = useCallback((currentOrder) => {
    return [...currentOrder.slice(1), currentOrder[0]];
  }, []);

  const handleDragEnd = useCallback(() => {
    const x = dragProgress.get();
    if (x <= SHUFFLE_THRESHOLD) {
      setOrder(shuffleOrder);
    }
    dragProgress.set(0);
  }, [dragProgress, shuffleOrder]);

  // Auto-shuffle every 800ms
  useEffect(() => {
    const intervalRef = setInterval(() => {
      if (!dragging && !isComplete) {
        setOrder(shuffleOrder);
      }
    }, AUTO_SHUFFLE_INTERVAL_MS);

    return () => clearInterval(intervalRef);
  }, [dragging, shuffleOrder, isComplete]);

  // Complete after 4.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
      if (onComplete) onComplete();
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // If complete, render nothing (transition to quiz)
  if (isComplete) {
    return null;
  }

  return (
    <div className="shuffle-loading-overlay">
      <div className="shuffle-loading-container">
        <p className="shuffle-loading-text">Shuffling the cards...</p>
        <div className="shuffle-card-stack">
          {order.map((position) => (
            <ShuffleCard
              key={position}
              position={order.indexOf(position)}
              handleDragEnd={handleDragEnd}
              dragProgress={dragProgress}
              dragging={dragging}
              setDragging={setDragging}
              isTop={order.indexOf(position) === 0}
            />
          ))}
        </div>
        <p className="shuffle-loading-subtext">Get ready!</p>
      </div>
    </div>
  );
};

const ShuffleCard = ({ position, handleDragEnd, dragProgress, dragging, setDragging, isTop }) => {
  const dragX = useMotionValue(0);

  useMotionValueEvent(dragX, 'change', (latest) => {
    if (typeof latest === 'number' && dragging) {
      dragProgress.set(latest);
    } else {
      dragProgress.set(0);
    }
  });

  const x = `${position * CARD_OFFSET_PERCENTAGE}%`;
  const rotateZ = `${position * ROTATION_DEGREE - 4}deg`;
  const zIndex = 100 - position;

  return (
    <motion.div
      style={{ 
        zIndex, 
        x: isTop ? dragX : 0,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
      }}
      animate={{ 
        rotate: rotateZ, 
        x: isTop ? 0 : x 
      }}
      drag={isTop ? "x" : false}
      dragElastic={0.35}
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => {
        setDragging(false);
        handleDragEnd();
      }}
      transition={{ duration: 0.35 }}
      className="shuffle-card-item"
    >
      <div className="shuffle-card-face">
        <img src="../card-back.png" alt="Card" className="shuffle-card-image" />
      </div>
    </motion.div>
  );
};

export default ShuffleLoading;