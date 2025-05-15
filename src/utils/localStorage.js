const LOCAL_STORAGE_KEY_TIMERS = 'appTimers';
const LOCAL_STORAGE_KEY_HISTORY = 'appTimerHistory';

export const loadTimers = () => {
  const storedTimers = localStorage.getItem(LOCAL_STORAGE_KEY_TIMERS);
  return storedTimers ? JSON.parse(storedTimers) : [];
};

export const saveTimers = (timers) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_TIMERS, JSON.stringify(timers));
};

export const loadHistory = () => {
  const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY_HISTORY);
  return storedHistory ? JSON.parse(storedHistory) : [];
};

export const saveHistory = (history) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(history));
}; 