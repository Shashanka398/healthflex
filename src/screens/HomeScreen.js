import React from 'react';
import AddTimerForm from '../components/AddTimerForm';
import TimerList from '../components/TimerList';

const HomeScreen = () => {
  return (
    <div>
      <AddTimerForm />
      <TimerList />
    </div>
  );
};

export default HomeScreen; 