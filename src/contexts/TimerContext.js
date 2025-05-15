import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loadTimers, saveTimers, loadHistory, saveHistory } from '../utils/localStorage';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timers, setTimers] = useState(() => loadTimers());
  const [history, setHistory] = useState(() => loadHistory());
  const [completedTimerInfo, setCompletedTimerInfo] = useState(null); // For completion modal

  useEffect(() => {
    saveTimers(timers);
  }, [timers]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addTimer = (timerData) => {
    const newTimer = {
      ...timerData,
      id: Date.now(),
      originalDuration: timerData.duration,
      remainingTime: timerData.duration,
      status: 'Paused',
      intervalId: null,
      enableHalfwayAlert: false,
      halfwayAlertTriggered: false,
    };
    setTimers(prevTimers => [...prevTimers, newTimer]);
  };

  const markAsCompleted = useCallback((timerId) => {
    setTimers(prevTimers => {
      const timerIndex = prevTimers.findIndex(t => t.id === timerId);
      if (timerIndex === -1) return prevTimers;

      const timer = prevTimers[timerIndex];

      if (timer.status === 'Completed') return prevTimers; // Already completed

      if (timer.intervalId) {
        clearInterval(timer.intervalId);
      }

      const completedTimerData = {
        ...timer,
        status: 'Completed',
        remainingTime: 0,
        intervalId: null
      };

      setHistory(prevHistory => [
        { ...completedTimerData, completedAt: Date.now() },
        ...prevHistory
      ]);

      setCompletedTimerInfo({ name: completedTimerData.name });
      
      const newTimers = [...prevTimers];
      newTimers[timerIndex] = completedTimerData;
      return newTimers;
    });
  }, [setTimers, setHistory, setCompletedTimerInfo]); // Stable dependencies

  const startTimer = useCallback((timerId) => {
    setTimers(prevTimers => {
      const timerIndex = prevTimers.findIndex(t => t.id === timerId);
      if (timerIndex === -1) return prevTimers;

      const timerToStart = prevTimers[timerIndex];

      if (timerToStart.status === 'Running' || timerToStart.status === 'Completed') {
        return prevTimers; // No change needed or cannot start
      }

      if (timerToStart.intervalId) { // Clear previous interval just in case
        clearInterval(timerToStart.intervalId);
      }

      const interval = setInterval(() => {
        setTimers(currentTimers => 
          currentTimers.map(t => {
            if (t.id === timerId && t.status === 'Running') {
              if (t.remainingTime > 0) {
                const newRemainingTime = t.remainingTime - 1;
                let halfwayAlertTriggered = t.halfwayAlertTriggered;

                if (t.enableHalfwayAlert && !t.halfwayAlertTriggered && newRemainingTime <= t.originalDuration / 2) {
                  alert(`Timer "${t.name}" is halfway through!`); // Consider better notification system
                  halfwayAlertTriggered = true;
                }

                if (newRemainingTime <= 0) {
                  clearInterval(interval);
                  // TimerItem's useEffect will call markAsCompleted based on state change
                  return { ...t, remainingTime: 0, intervalId: null, halfwayAlertTriggered };
                }
                return { ...t, remainingTime: newRemainingTime, halfwayAlertTriggered };
              } else { // remainingTime is 0 but status somehow still 'Running' without interval being cleared
                clearInterval(interval);
                return { ...t, remainingTime: 0, intervalId: null }; 
              }
            }
            return t;
          })
        );
      }, 1000);
      
      const newTimers = [...prevTimers];
      newTimers[timerIndex] = { ...timerToStart, status: 'Running', intervalId: interval, remainingTime: timerToStart.remainingTime > 0 ? timerToStart.remainingTime : timerToStart.originalDuration };
      return newTimers;
    });
  }, [setTimers]); // Stable dependency

  const pauseTimer = useCallback((timerId) => {
    setTimers(prevTimers => prevTimers.map(t => {
      if (t.id === timerId && t.status === 'Running') {
        if (t.intervalId) {
          clearInterval(t.intervalId);
        }
        return { ...t, status: 'Paused', intervalId: null };
      }
      return t;
    }));
  }, [setTimers]); // Stable dependency

  const resetTimer = useCallback((timerId) => {
    setTimers(prevTimers => prevTimers.map(t => {
      if (t.id === timerId) {
        if (t.intervalId) {
          clearInterval(t.intervalId);
        }
        return {
          ...t,
          remainingTime: t.originalDuration,
          status: 'Paused',
          intervalId: null,
          halfwayAlertTriggered: false
        };
      }
      return t;
    }));
  }, [setTimers]); // Stable dependency

  const setHalfwayAlert = useCallback((timerId, enable) => {
    setTimers(prevTimers => prevTimers.map(t => {
      if (t.id === timerId) {
        return {
          ...t,
          enableHalfwayAlert: enable,
          halfwayAlertTriggered: enable ? false : t.halfwayAlertTriggered // if enabling, reset trigger; else keep current state
        };
      }
      return t;
    }));
  }, [setTimers]); // Stable dependency

  const closeCompletionModal = () => {
    setCompletedTimerInfo(null);
  };

  const startAllInCategory = useCallback((category) => {
    timers.forEach(timer => {
      if (timer.category === category && timer.status !== 'Running' && timer.status !== 'Completed') {
        startTimer(timer.id); // startTimer is stable, will use current state internally
      }
    });
  }, [timers, startTimer]);

  const pauseAllInCategory = useCallback((category) => {
    timers.forEach(timer => {
      if (timer.category === category && timer.status === 'Running') {
        pauseTimer(timer.id);
      }
    });
  }, [timers, pauseTimer]);

  const resetAllInCategory = useCallback((category) => {
    timers.forEach(timer => {
      if (timer.category === category) {
        resetTimer(timer.id);
      }
    });
  }, [timers, resetTimer]);

  // Cleanup intervals on unmount or when timers array instance changes (e.g., timers removed)
  useEffect(() => {
    // This cleanup function runs with the `timers` value from the time the effect was set up.
    const timersToClear = timers;
    return () => {
      timersToClear.forEach(timer => {
        if (timer.intervalId) {
          clearInterval(timer.intervalId);
        }
      });
    };
  }, [timers]);

  return (
    <TimerContext.Provider value={{
      timers,
      history,
      addTimer,
      startTimer,
      pauseTimer,
      resetTimer,
      markAsCompleted, 
      setHalfwayAlert,
      // setHistory, // Only used internally by markAsCompleted now, might not need to be exposed
      completedTimerInfo,
      closeCompletionModal,
      startAllInCategory,
      pauseAllInCategory,
      resetAllInCategory
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export default TimerContext; 