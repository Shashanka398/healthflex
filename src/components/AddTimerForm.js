import React, { useState, useContext } from 'react';
import TimerContext from '../contexts/TimerContext';
import './AddTimerForm.css';

const AddTimerForm = () => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const { addTimer } = useContext(TimerContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !duration || !category.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    const durationInSeconds = parseInt(duration, 10);
    if (isNaN(durationInSeconds) || durationInSeconds <= 0) {
      alert('Please enter a valid duration (positive number of seconds).');
      return;
    }

    addTimer({ name, duration: durationInSeconds, category });
    setName('');
    setDuration('');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-timer-form">
      <h2>Add New Timer</h2>
      <div className="form-group">
        <label htmlFor="timer-name">Name:</label>
        <input
          type="text"
          id="timer-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Workout Timer"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="timer-duration">Duration (seconds):</label>
        <input
          type="number"
          id="timer-duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g., 60"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="timer-category">Category:</label>
        <input
          type="text"
          id="timer-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Workout, Study"
          required
        />
      </div>
      <button type="submit">Add Timer</button>
    </form>
  );
};

export default AddTimerForm; 