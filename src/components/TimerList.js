import React, { useContext } from 'react';
import TimerContext from '../contexts/TimerContext';
import CategorySection from './CategorySection';
import './TimerList.css';

const TimerList = () => {
  const { timers } = useContext(TimerContext);

  const timersByCategory = timers.reduce((acc, timer) => {
    const category = timer.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(timer);
    return acc;
  }, {});

  if (timers.length === 0) {
    return <p className="no-timers-message">No timers added yet. Add one above!</p>;
  }

  return (
    <div className="timer-list-container">
      <h2>All Timers</h2>
      {Object.keys(timersByCategory).sort().map(category => (
        <CategorySection
          key={category}
          category={category}
          timers={timersByCategory[category]}
        />
      ))}
    </div>
  );
};

export default TimerList; 