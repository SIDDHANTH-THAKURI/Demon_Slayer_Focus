import React from 'react';
import { Task } from '../types';
import Ring from './Ring';

interface TaskCardProps {
  task: Task;
  onDone: (id: string, victoryNote: string) => void;
  onGiveUp: (id: string) => void;
  onTogglePause: (id: string) => void;
  isActive: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDone, onGiveUp, onTogglePause, isActive }) => {
  const [victoryNote, setVictoryNote] = React.useState('');

  const handleDone = () => {
    onDone(task.id, victoryNote);
  };

  return (
    <div className={`task-card p-4 rounded-lg shadow-glass mb-4 ${isActive ? 'border-2 border-accent' : ''}`}>
      <h3 className="text-xl font-bold mb-2">{task.title}</h3>
      <div className="flex items-center justify-between">
        <Ring
          remainingTime={task.remainingTime}
          initialMinutes={task.initialMinutes}
          status={task.status}
        />
        <div className="flex flex-col space-y-2">
          {task.status === 'active' && (
            <button
              onClick={() => onTogglePause(task.id)}
              className="bg-accent2 hover:bg-accent focus:ring-accent2 text-white px-4 py-2 rounded-lg"
            >
              {task.paused ? 'Resume' : 'Pause'}
            </button>
          )}
          {task.status === 'active' && (
            <button
              onClick={handleDone}
              className="bg-good hover:bg-green-600 focus:ring-good text-white px-4 py-2 rounded-lg"
            >
              Done ✅
            </button>
          )}
          {task.status === 'active' && (
            <button
              onClick={() => onGiveUp(task.id)}
              className="bg-bad hover:bg-red-600 focus:ring-bad text-white px-4 py-2 rounded-lg"
            >
              Give Up 😵
            </button>
          )}
          {task.status === 'done' && (
            <input
              type="text"
              placeholder="Victory note..."
              value={victoryNote}
              onChange={(e) => setVictoryNote(e.target.value)}
              className="mt-2 p-2 rounded-lg bg-gray-700 text-ink"
            />
          )}
        </div>
      </div>
      {task.status === 'failed' && (
        <p className="text-bad mt-2">Task Failed!</p>
      )}
    </div>
  );
};

export default TaskCard;