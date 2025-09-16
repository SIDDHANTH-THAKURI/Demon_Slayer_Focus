import React, { useState } from 'react';
import { Task } from '../types';
import BreathingRing from './Ring';
import PatternLibrary from './PatternLibrary';
import { getTechniqueTheme } from '../config/techniques';

interface TaskCardProps {
  task: Task;
  onStart: (id: string) => void;
  onDone: (id: string, victoryNote: string) => void;
  onGiveUp: (id: string) => void;
  onTogglePause: (id: string) => void;
  isActive: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStart, onDone, onGiveUp, onTogglePause, isActive }) => {
  const [isBreathing, setIsBreathing] = useState(false);
  
  const handleDone = () => {
    const note = window.prompt('✨ How does completing this task with ' + techniqueTheme.name + ' feel?') || '';
    onDone(task.id, note);
  };

  const handleStart = () => {
    onStart(task.id);
    setIsBreathing(true);
  };

  // Get the technique theme, fallback to water if not set
  const techniqueTheme = getTechniqueTheme(task.breathingTechnique || 'water');

  const getScrollBackground = () => {
    switch (task.status) {
      case 'done':
        return 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)';
      case 'failed':
        return 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
      default:
        return techniqueTheme.colors.background;
    }
  };

  const getStatusEmoji = () => {
    switch (task.status) {
      case 'pending': return techniqueTheme.kanji;
      case 'active': return task.paused ? '⏸️' : techniqueTheme.kanji;
      case 'done': return '🎉';
      case 'failed': return '💫';
      default: return techniqueTheme.kanji;
    }
  };

  const getTimeRemaining = () => {
    const seconds = Math.ceil(task.remainingTime / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMasteryDisplay = () => {
    const level = task.masteryLevel || 1;
    const stars = '★'.repeat(Math.min(level, 5)) + '☆'.repeat(Math.max(0, 5 - level));
    return stars;
  };

  return (
    <div className={`
      relative overflow-hidden rounded-3xl transition-all duration-500 transform
      ${isActive ? 'scale-105 shadow-2xl' : 'shadow-lg hover:shadow-xl'}
    `}
    style={{
      background: getScrollBackground(),
      border: `3px solid ${techniqueTheme.colors.primary}30`,
      boxShadow: `0 20px 40px ${techniqueTheme.colors.primary}20`
    }}>
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <PatternLibrary
          pattern={techniqueTheme.patterns.background}
          colors={[techniqueTheme.colors.primary, techniqueTheme.colors.secondary]}
          opacity={0.08}
        />
      </div>

      {/* Aged paper texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-amber-100 opacity-30" />

      {/* Traditional scroll header */}
      <div className="relative">
        <div 
          className="h-16 flex items-center justify-between px-8 py-4"
          style={{ 
            background: techniqueTheme.colors.gradient,
            borderBottom: `2px solid ${techniqueTheme.colors.primary}40`
          }}
        >
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-black text-white drop-shadow-lg">
              {getStatusEmoji()}
            </div>
            <div>
              <div className="text-white font-bold text-lg drop-shadow-md">
                {techniqueTheme.name}
              </div>
              <div className="text-white text-sm opacity-90">
                {getMasteryDisplay()} Level {task.masteryLevel || 1}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-white text-sm opacity-90 uppercase tracking-wider font-semibold">
              {task.status}
            </div>
            {task.status === 'active' && (
              <div className="text-white text-xs opacity-80">
                {getTimeRemaining()} remaining
              </div>
            )}
          </div>
        </div>

        {/* Decorative border elements */}
        <div className="absolute top-0 left-8 w-8 h-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-b-full opacity-60" />
        <div className="absolute top-0 right-8 w-8 h-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-b-full opacity-60" />
      </div>

      {/* Main content area */}
      <div className="relative p-8">
        {/* Task title with traditional styling */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 leading-tight mb-2 text-center">
            {task.title}
          </h3>
          <div className="flex items-center justify-center text-sm text-gray-600 space-x-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{task.initialMinutes} min focus</span>
            </div>
            <div className="text-gray-400">•</div>
            <div>
              {techniqueTheme.effects.breathingPattern.inhale}-{techniqueTheme.effects.breathingPattern.hold}-{techniqueTheme.effects.breathingPattern.exhale} breathing
            </div>
          </div>
        </div>

        {/* Enhanced Breathing Ring */}
        <div className="flex justify-center mb-8">
          <BreathingRing
            remainingTime={task.remainingTime}
            initialMinutes={task.initialMinutes}
            status={task.status}
            technique={task.breathingTechnique || 'water'}
            isBreathing={isBreathing && task.status === 'active' && !task.paused}
          />
        </div>

        {/* Action Buttons with Japanese styling */}
        <div className="space-y-4">
          {task.status === 'pending' && (
            <button
              onClick={handleStart}
              className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105"
              style={{ 
                background: techniqueTheme.colors.gradient,
                boxShadow: `0 8px 25px ${techniqueTheme.colors.primary}40`
              }}
            >
              <span className="flex items-center justify-center space-x-3">
                <span className="text-2xl">{techniqueTheme.kanji}</span>
                <span>Begin {techniqueTheme.name}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
            </button>
          )}

          {task.status === 'active' && (
            <div className="space-y-3">
              <button
                onClick={() => {
                  onTogglePause(task.id);
                  setIsBreathing(!task.paused);
                }}
                className="w-full py-3 px-6 rounded-2xl font-semibold bg-white bg-opacity-80 text-gray-700 border-2 border-gray-300 hover:bg-opacity-100 transition-all duration-300"
              >
                <span className="flex items-center justify-center space-x-2">
                  {task.paused ? (
                    <>
                      <span>Resume Breathing</span>
                      <span className="text-lg">{techniqueTheme.kanji}</span>
                    </>
                  ) : (
                    <>
                      <span>Pause Flow</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDone}
                  className="py-3 px-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complete</span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    onGiveUp(task.id);
                    setIsBreathing(false);
                  }}
                  className="py-3 px-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center space-x-2">
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
              <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-green-600 mb-2">
                {techniqueTheme.name} Mastered!
              </h4>
              <p className="text-gray-600 mb-4">Your focus flows like {techniqueTheme.description.toLowerCase()}</p>
              {task.victoryNote && (
                <div className="mt-4 p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                  <p className="text-sm text-green-700 italic font-medium">"{task.victoryNote}"</p>
                </div>
              )}
            </div>
          )}

          {task.status === 'failed' && (
            <div className="text-center py-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-red-400 to-pink-500 shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-red-500 mb-2">Training Continues</h4>
              <p className="text-gray-600">Every breath brings you closer to mastery</p>
            </div>
          )}
        </div>

        {/* Breathing indicator for active tasks */}
        {isActive && task.status === 'active' && !task.paused && (
          <div className="mt-6 flex items-center justify-center space-x-3" style={{ color: techniqueTheme.colors.primary }}>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: techniqueTheme.colors.primary, animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: techniqueTheme.colors.primary, animationDelay: '200ms' }}></div>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: techniqueTheme.colors.primary, animationDelay: '400ms' }}></div>
            </div>
            <span className="text-sm font-medium">Breathing in harmony</span>
          </div>
        )}
      </div>

      {/* Traditional scroll footer decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 opacity-40" />
      <div className="absolute bottom-0 left-8 w-8 h-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-t-full opacity-60" />
      <div className="absolute bottom-0 right-8 w-8 h-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-t-full opacity-60" />
    </div>
  );
};

export default TaskCard;