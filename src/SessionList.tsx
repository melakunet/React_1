// SessionList.tsx
import { memo } from 'react';

// A completed focus session
type Session = {
  task: string;
  duration: number;
};

type Props = {
  sessions: Session[];
};

export const SessionList = memo(({ sessions }: Props) => {
  console.log('render SessionList');

  if (sessions.length === 0) {
    return <p>No sessions yet. Start your first focus session!</p>;
  }

  return (
    <div>
      <h3>Completed Sessions</h3>
      <ul className="session-list">
        {sessions.map((session, index) => (
          <li key={index}>
            <strong>{session.task}</strong> — {session.duration}s
          </li>
        ))}
      </ul>
    </div>
  );
});

SessionList.displayName = 'SessionList';
