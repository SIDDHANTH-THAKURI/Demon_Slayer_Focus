import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Task } from './types';
import TaskCard from './components/TaskCard';
import { mountConfetti } from './lib/confetti';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveId] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState<string>('');
  const [minutesInput, setMinutesInput] = useState<string>('25');
  const [focusMode, setFocusMode] = useState<boolean>(false);

  const nextTaskId = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(Date.now());

  const confettiRef = useRef<ReturnType<typeof mountConfetti> | null>(null);
  useEffect(() => {
    confettiRef.current = mountConfetti();
  }, []);

  // --- Core Task Management Functions ---
  const addTask = useCallback(() => {
    if (titleInput.trim() === '' || isNaN(parseInt(minutesInput))) return;

    const newId = `task-${nextTaskId.current++}`;
    const initialMinutes = parseInt(minutesInput);
    const newTask: Task = {
      id: newId,
      title: titleInput,
      initialMinutes: initialMinutes,
      remainingTime: initialMinutes * 60 * 1000,
      status: 'pending',
      paused: true,
      sprints: 0,
      sprintProgress: 0,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTitleInput('');
    setMinutesInput('25');
  }, [titleInput, minutesInput]);

  const stopTimer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const giveUpTask = useCallback((id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: 'failed', paused: true } : task
      )
    );
    setActiveId(null);
    stopTimer();
  }, [stopTimer]);

  const handleTimeUpdate = useCallback(() => {
    const now = Date.now();
    const delta = now - lastTickTimeRef.current;
    lastTickTimeRef.current = now;

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === activeTaskId && task.status === 'active' && !task.paused) {
          const newRemainingTime = Math.max(0, task.remainingTime - delta);
          if (newRemainingTime === 0) {
            giveUpTask(task.id);
            return { ...task, remainingTime: 0, status: 'failed', paused: true };
          }
          return { ...task, remainingTime: newRemainingTime };
        }
        return task;
      })
    );
    animationFrameRef.current = requestAnimationFrame(handleTimeUpdate);
  }, [activeTaskId, giveUpTask]);

  const startTimer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(handleTimeUpdate);
  }, [handleTimeUpdate]);

  const startTask = useCallback((id: string) => {
    setActiveId(id);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: 'active', paused: false } : task
      )
    );
    lastTickTimeRef.current = Date.now();
    startTimer();
  }, [startTimer]);

  const togglePause = useCallback((id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, paused: !task.paused } : task
      )
    );
  }, []);

  const completeTask = useCallback((id: string, victoryNote: string = '') => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: 'done', paused: true, victoryNote } : task
      )
    );
    if (confettiRef.current) {
      confettiRef.current(window.innerWidth / 2, window.innerHeight / 2);
    }

    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
    if (taskElement) {
      taskElement.classList.add('celebration');
      setTimeout(() => {
        taskElement.classList.remove('celebration');
      }, 1000);
    }

    setActiveId(null);
    stopTimer();
  }, [stopTimer]);

  const resetSession = () => {
    if (window.confirm('Reset all tasks? This cannot be undone.')) {
      stopTimer();
      setTasks([]);
      setActiveId(null);
      nextTaskId.current = 0;
    }
  };

  // --- Effects ---
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (document.activeElement?.id === 'task-input' || document.activeElement?.id === 'minutes-input')) {
        addTask();
      } else if (e.key === ' ' && activeTaskId) {
        e.preventDefault();
        togglePause(activeTaskId);
      } else if (e.key === 'd' && activeTaskId) {
        completeTask(activeTaskId);
      } else if (e.key === 'g' && activeTaskId) {
        giveUpTask(activeTaskId);
      } else if (e.key === 'Escape' && focusMode) {
        setFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeTaskId, titleInput, minutesInput, addTask, togglePause, completeTask, giveUpTask, focusMode]);

  const completedTasks = tasks.filter(t => t.status === 'done').length;
    const activeTasks = tasks.filter(t => t.status === 'active').length;
    const failedTasks = tasks.filter(t => t.status === 'failed').length;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating background orbs */}
      <div className="floating-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen p-6">

        {/* Floating Header */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="glass-soft rounded-3xl p-8 fade-in-up">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                  style={{ background: 'linear-gradient(135deg, #ff9a9e, #fecfef)' }}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  TaskTimer Zen
                </h1>
                <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                  A vibrant space to track and celebrate your progress
                </p>
              </div>

            {/* Task Creation */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-7">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    What beautiful thing will you create?
                  </label>
                  <input
                    id="task-input"
                    type="text"
                    placeholder="Design the perfect interface..."
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="input-soft w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Focus time
                  </label>
                  <input
                    id="minutes-input"
                    type="number"
                    min="1"
                    value={minutesInput}
                    onChange={(e) => setMinutesInput(e.target.value)}
                    className="input-soft w-full"
                  />
                </div>
                <div className="md:col-span-3">
                  <button
                    onClick={addTask}
                    className="btn-soft btn-primary w-full"
                  >
                    ✨ Begin Journey
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        {tasks.length > 0 && (
          <div className="max-w-7xl mx-auto mb-12">
            <div className="glass-soft rounded-3xl p-8 scale-in">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-4xl font-black text-purple-600">{tasks.length}</div>
                  <div className="text-sm font-medium text-gray-600">Total Dreams</div>
                  <div className="status-dot status-pending mx-auto"></div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black text-green-500">{completedTasks}</div>
                  <div className="text-sm font-medium text-gray-600">Achieved</div>
                  <div className="status-dot status-done mx-auto"></div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black text-blue-500">{activeTasks}</div>
                  <div className="text-sm font-medium text-gray-600">In Flow</div>
                  <div className="status-dot status-active mx-auto"></div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black text-red-400">{failedTasks}</div>
                  <div className="text-sm font-medium text-gray-600">Learning</div>
                  <div className="status-dot status-failed mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Task Cards */}
        <div className="max-w-7xl mx-auto">
          {tasks.length === 0 ? (
            <div className="text-center py-20">
              <div className="glass-card rounded-3xl p-16 max-w-2xl mx-auto fade-in-up">
                <div className="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #a8edea, #fed6e3)' }}>
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-800">Ready to Flow?</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Create your first beautiful task and enter the zone of pure productivity
                </p>
              </div>
            </div>
          ) : (
            <div className="masonry-grid">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="floating-card bounce-gentle"
                  style={{ animationDelay: `${index * 0.2}s` }}
                  data-task-id={task.id}
                >
                  <TaskCard
                    task={task}
                    onStart={startTask}
                    onDone={completeTask}
                    onGiveUp={giveUpTask}
                    onTogglePause={togglePause}
                    isActive={task.id === activeTaskId}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-4">
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`btn-soft ${focusMode ? 'btn-primary' : 'btn-soft-secondary'} rounded-full w-16 h-16 flex items-center justify-center`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            onClick={resetSession}
            className="btn-soft btn-soft-secondary rounded-full w-16 h-16 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Focus Mode Overlay */}
        {focusMode && activeTaskId && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-2xl flex items-center justify-center z-50 p-8">
            <div className="max-w-2xl w-full">
              {tasks.filter(t => t.id === activeTaskId).map(task => (
                <div key={task.id} className="transform scale-110">
                  <TaskCard
                    task={task}
                    onStart={startTask}
                    onDone={completeTask}
                    onGiveUp={giveUpTask}
                    onTogglePause={togglePause}
                    isActive={true}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setFocusMode(false)}
              className="absolute top-8 right-8 btn-soft btn-soft-secondary rounded-full w-16 h-16 flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;