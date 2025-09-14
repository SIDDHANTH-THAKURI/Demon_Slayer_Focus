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

  // Audio control (placeholder)
  // useEffect(() => {
  //   initAudio();
  // }, []);

  // useEffect(() => {
  //   setAudio(audioOn);
  // }, [audioOn]);

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col items-center p-4">
      {/* Header */}
      <header className="text-4xl font-extrabold mb-8 text-accent">
        Finish-It!
      </header>

      {/* Commit Panel */}
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl2 shadow-glass mb-8">
        <h2 className="text-2xl font-bold mb-4">Commit to a Task</h2>
        <div className="flex flex-col space-y-4">
          <input
            id="task-title-input"
            type="text"
            placeholder="I will finish... (e.g., Code the new API endpoint)"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 text-ink focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="number"
            placeholder="in minutes (e.g., 25)"
            value={minutesInput}
            onChange={(e) => setMinutesInput(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 text-ink focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={addTask}
            className="bg-accent hover:bg-accent2 focus:ring-accent text-[#061022] font-extrabold p-3 rounded-lg shadow-md transition-colors"
          >
            Commit to Task
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="w-full max-w-md">
        {tasks.length === 0 ? (
          <p className="text-muted text-center">No tasks yet. Commit to one!</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStart={startTask}
              onDone={completeTask}
              onGiveUp={giveUpTask}
              onTogglePause={togglePause}
              isActive={task.id === activeTaskId}
            />
          ))
        )}
      </div>

      {/* Settings/Global Controls */}
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl2 shadow-glass mt-8">
        <h2 className="text-2xl font-bold mb-4">Session Controls</h2>
        <div className="flex flex-col space-y-4">
          <label className="flex items-center space-x-2 text-ink">
            <input
              type="checkbox"
              checked={focusMode}
              onChange={() => setFocusMode(!focusMode)}
              className="form-checkbox h-5 w-5 text-accent rounded"
            />
            <span>Focus Mode (Hide all except active task)</span>
          </label>
          <label className="flex items-center space-x-2 text-ink">
            <input
              type="checkbox"
              checked={chaosMode}
              onChange={() => setChaosMode(!chaosMode)}
              className="form-checkbox h-5 w-5 text-accent rounded"
            />
            <span>Chaos Mode (Random events)</span>
          </label>
          <label className="flex items-center space-x-2 text-ink">
            <input
              type="checkbox"
              checked={audioOn}
              onChange={() => setAudioOn(!audioOn)}
              className="form-checkbox h-5 w-5 text-accent rounded"
            />
            <span>Ambient Audio</span>
          </label>
          {/* Mercy and Stakes sliders can be added here */}
          <button
            onClick={resetSession}
            className="bg-bad hover:bg-red-600 focus:ring-bad text-white font-extrabold p-3 rounded-lg shadow-md transition-colors"
          >
            New Session (Purge All)
          </button>
          <button
            // onClick={generateSessionPoster}
            className="bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white font-extrabold p-3 rounded-lg shadow-md transition-colors"
          >
            Generate Session Poster (Placeholder)
          </button>
        </div>
      </div>

      {/* Focus Mode Overlay */}
      {focusMode && activeTaskId && (
        <div className="fixed inset-0 bg-bg bg-opacity-95 flex items-center justify-center z-50 p-4">
          {tasks.filter(t => t.id === activeTaskId).map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStart={startTask}
              onDone={completeTask}
              onGiveUp={giveUpTask}
              onTogglePause={togglePause}
              isActive={true} // Always active in focus mode
            />
          ))}
          <button
            onClick={() => setFocusMode(false)}
            className="absolute top-4 right-4 bg-white/20 text-ink p-2 rounded-full"
          >
            ESC to exit Focus Mode
          </button>
        </div>
      )}
    </div>
  );
};

export default App;