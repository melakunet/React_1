// FocusTracker.tsx
import { useEffect, useReducer, useRef, useCallback, useState } from 'react';
import { SessionList } from './SessionList';

// A completed focus session
type Session = {
  task: string;
  duration: number;
};

// Timer state
type State = {
  seconds: number;
  isRunning: boolean;
};

// Timer actions
type Action =
  | { type: 'start' }
  | { type: 'tick' }
  | { type: 'stop' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'start':
      return { seconds: 0, isRunning: true };
    case 'tick':
      return { ...state, seconds: state.seconds + 1 };
    case 'stop':
      return { ...state, isRunning: false };
    default:
      return state;
  }
}

export function FocusTracker() {
  const [task, setTask] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);

  const [{ seconds, isRunning }, dispatch] = useReducer(reducer, {
    seconds: 0,
    isRunning: false,
  });

  const startButtonRef = useRef<HTMLButtonElement>(null);

  // Focus the Start button on load
  useEffect(() => {
    startButtonRef.current?.focus();
  }, []);

  // Run the timer interval while a session is active
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Stop the session and save it to the list
  const handleStop = useCallback(() => {
    if (!isRunning) return;
    setSessions((prev) => [...prev, { task, duration: seconds }]);
    dispatch({ type: 'stop' });
    setTask('');
    console.log('render Stop');
  }, [isRunning, task, seconds]);

  const handleStart = () => {
    if (!task.trim()) return;
    dispatch({ type: 'start' });
  };

  return (
    <div id="center">
      <h2>Focus Tracker</h2>

      <input
        className="task-input"
        type="text"
        placeholder="Enter task name..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        disabled={isRunning}
      />

      <button
        className="btn"
        ref={startButtonRef}
        onClick={handleStart}
        disabled={isRunning || !task.trim()}
      >
        Start
      </button>

      <div className="timer">
        <span className="counter">{seconds}s</span>
      </div>

      <button className="btn" onClick={handleStop} disabled={!isRunning}>
        Stop
      </button>

      <SessionList sessions={sessions} />
    </div>
  );
}
