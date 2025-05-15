import React, { useContext } from 'react';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import TimerContext, { TimerProvider } from './contexts/TimerContext';
import CompletionModal from './components/CompletionModal';

function AppContent() {
  const [currentScreen, setCurrentScreen] = React.useState('home');
  const { completedTimerInfo, closeCompletionModal } = useContext(TimerContext);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Timer Application</h1>
        <nav>
          <button onClick={() => setCurrentScreen('home')} className={currentScreen === 'home' ? 'active' : ''}>Home</button>
          <button onClick={() => setCurrentScreen('history')} className={currentScreen === 'history' ? 'active' : ''}>History</button>
        </nav>
      </header>
      <main>
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'history' && <HistoryScreen />}
      </main>
      {completedTimerInfo && (
        <CompletionModal
          timerName={completedTimerInfo.name}
          onClose={closeCompletionModal}
        />
      )}
    </div>
  );
}

export default App;
