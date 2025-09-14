import React from 'react';
import { Task } from '../types';
import Ring from './Ring';

interface TaskCardProps {
  task: Task;
  onStart: (id: string) => void;
  onDone: (id: string, victoryNote: string) => void;
  onGiveUp: (id: string) => void;
  onTogglePause: (id: string) => void;
  isActive: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStart, onDone, onGiveUp, onTogglePause, isActive }) => {
  const handleDone = () => {
    const note = window.prompt('Victory note?') || '';
    onDone(task.id, note);
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
          {task.status === 'pending' && (
            <button
              onClick={() => onStart(task.id)}
              className="bg-accent hover:bg-accent2 focus:ring-accent text-[#061022] px-4 py-2 rounded-lg"
            >
              Start
            </button>
          )}
          {task.status === 'active' && (
            <>
              <button
                onClick={() => onTogglePause(task.id)}
                className="bg-accent2 hover:bg-accent focus:ring-accent2 text-white px-4 py-2 rounded-lg"
              >
                {task.paused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={handleDone}
                className="bg-good hover:bg-green-600 focus:ring-good text-white px-4 py-2 rounded-lg"
              >
                Done ✅
              </button>
              <button
                onClick={() => onGiveUp(task.id)}
                className="bg-bad hover:bg-red-600 focus:ring-bad text-white px-4 py-2 rounded-lg"
              >
                Give Up 😵
              </button>
            </>
          )}
          {task.status === 'done' && task.victoryNote && (
            <p className="mt-2 text-good">{task.victoryNote}</p>
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