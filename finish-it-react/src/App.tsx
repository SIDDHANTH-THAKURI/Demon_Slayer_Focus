import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Task } from './types';
import TaskCard from './components/TaskCard';
// import Ring from './components/Ring'; // Will be used within TaskCard
import { mountConfetti } from './lib/confetti';
// import { initAudio, setAudio, playTick } from './lib/audio';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveId] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState<string>('');
  const [minutesInput, setMinutesInput] = useState<string>('25');
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [chaosMode, setChaosMode] = useState<boolean>(false);
  const [audioOn, setAudioOn] = useState<boolean>(false);

  const nextTaskId = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(Date.now());

  // Placeholder for confetti activation
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
      sprints: 0, // Not implemented yet
      sprintProgress: 0, // Not implemented yet
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
    // Implement blur/penalty here later
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

    // Add celebration effect
    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
    if (taskElement) {
      taskElement.classList.add('success-burst');
      setTimeout(() => {
        taskElement.classList.remove('success-burst');
      }, 1000);
    }

    setActiveId(null);
    stopTimer();
  }, [stopTimer]);

  const resetSession = () => {
    stopTimer();
    setTasks([]);
    setActiveId(null);
    nextTaskId.current = 0;
    // Reset other settings if needed
  };

  // --- Effects ---
  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && document.activeElement?.id === 'task-title-input') {
        addTask();
      } else if (e.key === ' ' && activeTaskId) {
        e.preventDefault();
        togglePause(activeTaskId);
      } else if (e.key === 'd' && activeTaskId) {
        completeTask(activeTaskId);
      } else if (e.key === 'g' && activeTaskId) {
        giveUpTask(activeTaskId);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeTaskId, titleInput, minutesInput, addTask, togglePause, completeTask, giveUpTask]);

  // Page Visibility API (Distraction Meter - placeholder)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && activeTaskId && !tasks.find(t => t.id === activeTaskId)?.paused) {
        console.log('Tab hidden, potentially speeding up timer...');
        // Implement timer acceleration here later
      } else if (!document.hidden) {
        console.log('Tab visible, resetting timer speed...');
        lastTickTimeRef.current = Date.now(); // Reset last tick time on return
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeTaskId, tasks]);

  // Allow exiting focus mode with ESC
  useEffect(() => {
    if (!focusMode) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocusMode(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [focusMode]);

  return (
    <div className="min-h-screen bg-cyberpunk text-ink relative overflow-hidden">
      {/* Neon grid overlay */}
      <div className="grid-overlay"></div>
      
      {/* Floating neon particles */}
      <div className="neon-particles">
        {[...Array(15)].map((_, i) => {
          const colors = ['green', 'pink', 'cyan'];
          const color = colors[i % 3];
          return (
            <div
              key={i}
              className={`neon-particle ${color}`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 flex flex-col items-center p-6 max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16 fade-in">
          <h1 className="glitch text-6xl md:text-8xl font-black mb-6" data-text="FINISH-IT">
            FINISH-IT
          </h1>
          <div className="flex items-center justify-center space-x-4 text-lg">
            <span className="text-accent">◉</span>
            <span className="text-muted font-mono uppercase tracking-wider">CYBERPUNK PRODUCTIVITY ARENA</span>
            <span className="text-accent2">◉</span>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="w-full grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Left Column - Task Creation */}
          <div className="xl:col-span-1 space-y-6">
            {/* Mission Control Panel */}
            <div className="neon-card p-8 fade-in">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-accent rounded-full mr-3 neon-pulse"></div>
                <h2 className="text-xl font-bold text-accent uppercase tracking-wider">NEW MISSION</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-mono text-muted mb-2 uppercase">TARGET OBJECTIVE</label>
                  <input
                    id="task-title-input"
                    type="text"
                    placeholder="Enter mission parameters..."
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="neon-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-muted mb-2 uppercase">TIME ALLOCATION</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="25"
                      value={minutesInput}
                      onChange={(e) => setMinutesInput(e.target.value)}
                      className="neon-input w-full pr-16"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-accent text-sm font-mono">
                      MIN
                    </span>
                  </div>
                </div>
                <button
                  onClick={addTask}
                  className="neon-btn neon-btn-primary w-full py-4 text-lg"
                >
                  ⚡ INITIALIZE MISSION
                </button>
              </div>
            </div>

            {/* System Controls */}
            <div className="neon-card p-6 fade-in">
              <h3 className="text-lg font-bold text-accent2 mb-4 uppercase tracking-wider flex items-center">
                <span className="w-2 h-2 bg-accent2 rounded-full mr-2 neon-pulse"></span>
                SYSTEM CONFIG
              </h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={focusMode}
                    onChange={() => setFocusMode(!focusMode)}
                    className="w-5 h-5 rounded bg-black border-2 border-accent checked:bg-accent transition-all duration-300"
                  />
                  <span className="group-hover:text-accent transition-colors font-mono">🎯 FOCUS PROTOCOL</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={chaosMode}
                    onChange={() => setChaosMode(!chaosMode)}
                    className="w-5 h-5 rounded bg-black border-2 border-warning checked:bg-warning transition-all duration-300"
                  />
                  <span className="group-hover:text-warning transition-colors font-mono">⚡ CHAOS ENGINE</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={audioOn}
                    onChange={() => setAudioOn(!audioOn)}
                    className="w-5 h-5 rounded bg-black border-2 border-accent3 checked:bg-accent3 transition-all duration-300"
                  />
                  <span className="group-hover:text-accent3 transition-colors font-mono">🎵 NEURAL SYNC</span>
                </label>
              </div>
              <div className="mt-6 space-y-3">
                <button
                  onClick={resetSession}
                  className="neon-btn neon-btn-danger w-full py-3"
                >
                  🔥 SYSTEM PURGE
                </button>
                <button
                  className="neon-btn neon-btn-secondary w-full py-3"
                >
                  📊 DATA EXPORT
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Mission Dashboard */}
          <div className="xl:col-span-3">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-accent uppercase tracking-wider flex items-center">
                  <span className="w-3 h-3 bg-good rounded-full mr-3 neon-pulse"></span>
                  ACTIVE MISSIONS
                </h2>
                <div className="flex items-center space-x-6 text-sm font-mono">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-good rounded-full neon-pulse"></div>
                    <span className="text-good">{tasks.filter(t => t.status === 'done').length} COMPLETE</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-accent rounded-full neon-pulse"></div>
                    <span className="text-accent">{tasks.filter(t => t.status === 'active').length} ACTIVE</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <span className="text-muted">{tasks.filter(t => t.status === 'pending').length} PENDING</span>
                  </div>
                </div>
              </div>
              
              {tasks.length > 0 && (
                <div className="neon-progress h-3 mb-6">
                  <div 
                    className="neon-progress-fill"
                    style={{ 
                      width: `${(tasks.filter(t => t.status === 'done').length / tasks.length) * 100}%` 
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tasks.length === 0 ? (
                <div className="lg:col-span-2 neon-card p-16 text-center fade-in">
                  <div className="text-8xl mb-6">⚡</div>
                  <h3 className="text-2xl font-bold text-accent mb-4 uppercase tracking-wider">SYSTEM READY</h3>
                  <p className="text-muted font-mono">Initialize your first mission to begin neural synchronization</p>
                </div>
              ) : (
                tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="slide-up hover-glow"
                    style={{ animationDelay: `${index * 0.1}s` }}
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Focus Mode Overlay */}
      {focusMode && activeTaskId && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-50 p-6">
          <div className="max-w-4xl w-full">
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
            className="absolute top-8 right-8 neon-btn neon-btn-secondary p-4 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;