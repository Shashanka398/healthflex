import React from 'react';
import './CompletionModal.css';

const CompletionModal = ({ timerName, onClose }) => {
  if (!timerName) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Congratulations!</h2>
        <p>The timer "<strong>{timerName}</strong>" has completed.</p>
        <button onClick={onClose} className="modal-close-button">Close</button>
      </div>
    </div>
  );
};

export default CompletionModal; 