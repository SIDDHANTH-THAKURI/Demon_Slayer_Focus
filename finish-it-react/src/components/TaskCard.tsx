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
    const note = window.prompt('🔥 How does it feel to finish this mission?') || '';
    onDone(task.id, note);
  };

  const getGradientByStatus = () => {
    switch (task.status) {
      case 'pending':
        return 'linear-gradient(135deg, #16a34a 0%, #1e293b 100%)';
      case 'active':
        return 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)';
      case 'done':
        return 'linear-gradient(135deg, #fbbf24 0%, #f87171 100%)';
      case 'failed':
        return 'linear-gradient(135deg, #4b5563 0%, #1f2937 100%)';
      default:
        return 'linear-gradient(135deg, #16a34a 0%, #1e293b 100%)';
    }
  };

  const getStatusEmoji = () => {
    switch (task.status) {
      case 'pending': return '🎴';
      case 'active': return task.paused ? '⏸️' : '💥';
      case 'done': return '🔥';
      case 'failed': return '💀';
      default: return '🎴';
    }
  };

  const getTimeRemaining = () => {
    const seconds = Math.ceil(task.remainingTime / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`glass-card rounded-3xl p-8 ${isActive ? 'pulse-soft' : ''}`}>
      {/* Gradient Header */}
      <div 
        className="h-2 rounded-full mb-6"
        style={{ background: getGradientByStatus() }}
      />

      {/* Task Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">{getStatusEmoji()}</span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {task.status}
              </span>
              {task.status === 'active' && (
                <span className="text-xs text-green-400 font-medium">
                  {getTimeRemaining()} remaining
                </span>
              )}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-100 leading-tight mb-2">
            {task.title}
          </h3>
          <div className="flex items-center text-sm text-gray-400 space-x-3">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{task.initialMinutes} min session</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center mb-8">
        <Ring
          remainingTime={task.remainingTime}
          initialMinutes={task.initialMinutes}
          status={task.status}
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {task.status === 'pending' && (
          <button
            onClick={() => onStart(task.id)}
            className="btn-soft btn-primary w-full"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Begin Mission</span>
            </span>
          </button>
        )}

        {task.status === 'active' && (
          <div className="space-y-3">
            <button
              onClick={() => onTogglePause(task.id)}
              className="btn-soft btn-soft-secondary w-full"
            >
              <span className="flex items-center justify-center space-x-2">
                {task.paused ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Resume Hunt</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Pause Hunt</span>
                  </>
                )}
              </span>
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDone}
                className="btn-soft btn-success"
              >
                <span className="flex items-center justify-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Victory</span>
                </span>
              </button>
              <button
                onClick={() => onGiveUp(task.id)}
                className="btn-soft btn-danger"
              >
                <span className="flex items-center justify-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Retreat</span>
                </span>
              </button>
            </div>
          </div>
        )}

        {task.status === 'done' && (
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                 style={{background: 'linear-gradient(135deg, #fbbf24, #f87171)'}}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-yellow-400 mb-2">Flawless Victory!</h4>
            <p className="text-gray-300">You've completed this mission</p>
            {task.victoryNote && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
                <p className="text-sm text-yellow-700 italic">"{task.victoryNote}"</p>
              </div>
            )}
          </div>
        )}

        {task.status === 'failed' && (
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                 style={{background: 'linear-gradient(135deg, #4b5563, #1f2937)'}}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-400 mb-2">A Setback</h4>
            <p className="text-gray-300">Every attempt makes you stronger</p>
          </div>
        )}
      </div>

      {/* Active Hunt Indicator */}
      {isActive && task.status === 'active' && (
        <div className="mt-6 flex items-center justify-center space-x-3 text-green-500">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm font-medium">On the hunt</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
