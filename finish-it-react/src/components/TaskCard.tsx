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
    const note = window.prompt('✨ How does it feel to complete this beautiful task?') || '';
    onDone(task.id, note);
  };

  const getGradientByStatus = () => {
    switch (task.status) {
      case 'pending':
        return 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
      case 'active':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'done':
        return 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
      case 'failed':
        return 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)';
      default:
        return 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
    }
  };

  const getStatusEmoji = () => {
    switch (task.status) {
      case 'pending': return '🌸';
      case 'active': return task.paused ? '⏸️' : '✨';
      case 'done': return '🎉';
      case 'failed': return '💫';
      default: return '🌸';
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
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {task.status}
              </span>
              {task.status === 'active' && (
                <span className="text-xs text-purple-600 font-medium">
                  {getTimeRemaining()} remaining
                </span>
              )}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 leading-tight mb-2">
            {task.title}
          </h3>
          <div className="flex items-center text-sm text-gray-500 space-x-3">
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
              <span>Enter Flow State</span>
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
                    <span>Resume Flow</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Pause Flow</span>
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
                  <span>Complete</span>
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
                  <span>Release</span>
                </span>
              </button>
            </div>
          </div>
        )}

        {task.status === 'done' && (
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                 style={{background: 'linear-gradient(135deg, #48bb78, #38a169)'}}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-green-600 mb-2">Beautiful Work!</h4>
            <p className="text-gray-600">You've achieved something wonderful</p>
            {task.victoryNote && (
              <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-200">
                <p className="text-sm text-green-700 italic">"{task.victoryNote}"</p>
              </div>
            )}
          </div>
        )}

        {task.status === 'failed' && (
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                 style={{background: 'linear-gradient(135deg, #f56565, #e53e3e)'}}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-red-500 mb-2">Learning Moment</h4>
            <p className="text-gray-600">Every attempt makes you stronger</p>
          </div>
        )}
      </div>

      {/* Active Flow Indicator */}
      {isActive && task.status === 'active' && (
        <div className="mt-6 flex items-center justify-center space-x-3 text-purple-600">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm font-medium">In beautiful flow</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;