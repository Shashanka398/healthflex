import React, { useContext } from 'react';
import TimerContext from '../contexts/TimerContext';

const HistoryScreen = () => {
  const { history } = useContext(TimerContext);

  return (
    <div>
      <h2>Timer History</h2>
      {history.length === 0 ? (
        <p>No timers completed yet.</p>
      ) : (
        <ul>
          {history.map(item => (
            <li key={item.id}>
              {item.name} - Completed at: {new Date(item.completedAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryScreen; 