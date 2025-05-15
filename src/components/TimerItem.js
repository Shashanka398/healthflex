import React, { useContext, useEffect, useState } from 'react';
import TimerContext from '../contexts/TimerContext';
import './TimerItem.css'; // We will create this CSS file next

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const TimerItem = ({ timer }) => {
  const {
    startTimer, pauseTimer, resetTimer, markAsCompleted, setHalfwayAlert
  } = useContext(TimerContext);

  const [showHalfwayAlertConfig, setShowHalfwayAlertConfig] = useState(false);

  const progressPercent = (timer.originalDuration - timer.remainingTime) / timer.originalDuration * 100;

  // Effect to handle timer completion and cleanup
  useEffect(() => {
    if (timer.status === 'Running' && timer.remainingTime <= 0) {
      markAsCompleted(timer.id);
    }
  }, [timer.remainingTime, timer.status, timer.id, markAsCompleted]);

  // Effect to handle interval cleanup when component unmounts or timer status changes
  useEffect(() => {
    // This will be more relevant when actual timer logic is in TimerContext
    // For now, it acts as a placeholder for cleanup logic
    return () => {
      if (timer.intervalId) {
        // This is a conceptual cleanup, actual clearing will happen in context
        // console.log(`Clearing interval ${timer.intervalId} for timer ${timer.name} (conceptual)`);
      }
    };
  }, [timer.intervalId, timer.name]);

  const handleSetHalfwayAlert = (e) => {
    setHalfwayAlert(timer.id, e.target.checked);
  };

  return (
    <div className={`timer-item timer-status-${timer.status?.toLowerCase()}`}>
      <div className="timer-info">
        <h3>{timer.name}</h3>
        <p className="timer-category-display">Category: {timer.category}</p>
        <p className="timer-time">Remaining: {formatTime(timer.remainingTime)} / {formatTime(timer.originalDuration)}</p>
        <p className="timer-status">Status: {timer.status}</p>
      </div>

      <div className="timer-progress-bar-container">
        <div
          className="timer-progress-bar"
          style={{ width: `${progressPercent}%` }}
        ></div>
        <span className="timer-progress-percent">{Math.round(progressPercent)}%</span>
      </div>

      <div className="timer-controls">
        {timer.status !== 'Running' && (
          <button onClick={() => startTimer(timer.id)} className="control-button start-button">Start</button>
        )}
        {timer.status === 'Running' && (
          <button onClick={() => pauseTimer(timer.id)} className="control-button pause-button">Pause</button>
        )}
        <button onClick={() => resetTimer(timer.id)} className="control-button reset-button">Reset</button>
      </div>

      <div className="timer-extra-config">
        <button onClick={() => setShowHalfwayAlertConfig(!showHalfwayAlertConfig)} className="control-button config-button">
          {showHalfwayAlertConfig ? 'Hide' : 'Alerts'}
        </button>
        {showHalfwayAlertConfig && (
          <div className="halfway-alert-config">
            <label>
              <input
                type="checkbox"
                checked={timer.enableHalfwayAlert || false} // Ensure controlled component
                onChange={handleSetHalfwayAlert}
              />
              Enable Halfway Alert (at {formatTime(Math.floor(timer.originalDuration / 2))})
            </label>
          </div>
        )}
      </div>

      {timer.status === 'Completed' && <p className="completion-message">Timer Completed!</p>}
    </div>
  );
};

export default TimerItem; 