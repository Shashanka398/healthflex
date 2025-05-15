import React, { useState, useContext } from 'react';
import TimerItem from './TimerItem';
import TimerContext from '../contexts/TimerContext';
import './CategorySection.css';

const CategorySection = ({ category, timers }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { startAllInCategory, pauseAllInCategory, resetAllInCategory } = useContext(TimerContext);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleStartAll = (e) => {
    e.stopPropagation();
    startAllInCategory(category);
  };

  const handlePauseAll = (e) => {
    e.stopPropagation();
    pauseAllInCategory(category);
  };

  const handleResetAll = (e) => {
    e.stopPropagation();
    resetAllInCategory(category);
  };

  if (!timers || timers.length === 0) {
    return null;
  }

  return (
    <div className="category-section">
      <div className="category-header" onClick={toggleOpen}>
        <h3>
          {category} <span className="toggle-icon">{isOpen ? '▼' : '▶'}</span>
        </h3>
        {isOpen && (
          <div className="bulk-actions">
            <button onClick={handleStartAll}>Start All</button>
            <button onClick={handlePauseAll}>Pause All</button>
            <button onClick={handleResetAll}>Reset All</button>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="timers-container">
          {timers.map(timer => (
            <TimerItem key={timer.id} timer={timer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection; 