import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Task, BreathingTechnique, UserStats, TechniqueStats } from './types';
import TaskCard from './components/TaskCard';
import TechniqueSelector from './components/TechniqueSelector';
import BackgroundLayer from './components/BackgroundLayer';
import ParticleSystem from './components/ParticleSystem';
import StatsRankDashboard from './components/StatsRankDashboard';
import { mountConfetti } from './lib/confetti';
import { getAllTechniques, getTechniqueTheme, calculateRank, calculateMasteryPoints } from './config/techniques';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveId] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState<string>('');
  const [minutesInput, setMinutesInput] = useState<string>('25');
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>('water');
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [showTechniqueSelector, setShowTechniqueSelector] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [completionParticles, setCompletionParticles] = useState<{ technique: BreathingTechnique; active: boolean } | null>(null);

  const nextTaskId = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const confettiRef = useRef<ReturnType<typeof mountConfetti> | null>(null);
  useEffect(() => {
    confettiRef.current = mountConfetti();
  }, []);

  // Calculate user stats from tasks
  const calculateUserStats = useCallback((): UserStats => {
    const completedTasks = tasks.filter(t => t.status === 'done');
    const totalFocusTime = completedTasks.reduce((total, task) => total + task.initialMinutes, 0);
    
    // Calculate technique-specific stats
    const masteryByTechnique: Record<BreathingTechnique, TechniqueStats> = {} as any;
    
    getAllTechniques().forEach(({ value: technique }) => {
      const techniqueTasks = tasks.filter(t => t.breathingTechnique === technique);
      const completedTechniqueTasks = techniqueTasks.filter(t => t.status === 'done');
      const techniqueTime = completedTechniqueTasks.reduce((total, task) => total + task.initialMinutes, 0);
      const averageCompletion = techniqueTasks.length > 0 
        ? (completedTechniqueTasks.length / techniqueTasks.length) * 100 
        : 0;
      
      const masteryPoints = calculateMasteryPoints(
        completedTechniqueTasks.length,
        techniqueTime,
        averageCompletion
      );
      
      masteryByTechnique[technique] = {
        totalTime: techniqueTime,
        completedTasks: completedTechniqueTasks.length,
        averageCompletion,
        masteryPoints,
        rank: calculateRank(masteryPoints)
      };
    });

    const totalMasteryPoints = Object.values(masteryByTechnique).reduce(
      (total, stats) => total + stats.masteryPoints, 0
    );

    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      totalFocusTime,
      currentRank: calculateRank(totalMasteryPoints),
      masteryByTechnique,
      achievements: []
    };
  }, [tasks]);

  // Update user stats when tasks change
  useEffect(() => {
    setUserStats(calculateUserStats());
  }, [tasks, calculateUserStats]);

  // Simple timer using setInterval
  const startTimer = useCallback(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    timerRef.current = setInterval(() => {
      setTasks((prevTasks) => {
        let timerShouldStop = true; // Assume we should stop unless we find an active task
        
        const updatedTasks = prevTasks.map((task) => {
          // Find any active, unpaused task (not just the specific activeTaskId)
          if (task.status === 'active' && !task.paused) {
            timerShouldStop = false; // We found an active task, keep timer running
            const newRemainingTime = Math.max(0, task.remainingTime - 1000); // Subtract 1 second
            
            if (newRemainingTime === 0) {
              // Task completed
              timerShouldStop = true;
              
              setTimeout(() => {
                if (confettiRef.current) {
                  confettiRef.current(window.innerWidth / 2, window.innerHeight / 2);
                }
                setActiveId(null);
              }, 0);
              
              return { 
                ...task, 
                remainingTime: 0, 
                status: 'done' as const, 
                paused: true,
                completedAt: new Date(),
                victoryNote: 'Time completed successfully!'
              };
            }
            
            return { ...task, remainingTime: newRemainingTime };
          }
          return task;
        });
        
        // Stop timer if no active tasks or task completed
        if (timerShouldStop && timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        return updatedTasks;
      });
    }, 1000); // Update every second
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Task management functions
  const addTask = useCallback(() => {
    if (titleInput.trim() === '' || isNaN(parseInt(minutesInput))) return;

    const newId = `task-${nextTaskId.current++}`;
    const initialMinutes = parseInt(minutesInput);
    
    const techniqueStats = userStats?.masteryByTechnique[selectedTechnique];
    const masteryLevel = techniqueStats ? Math.min(10, Math.floor(techniqueStats.masteryPoints / 50) + 1) : 1;
    
    const newTask: Task = {
      id: newId,
      title: titleInput,
      initialMinutes: initialMinutes,
      remainingTime: initialMinutes * 60 * 1000,
      status: 'pending',
      paused: true,
      sprints: 0,
      sprintProgress: 0,
      breathingTechnique: selectedTechnique,
      masteryLevel,
      createdAt: new Date(),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTitleInput('');
    setMinutesInput('25');
    setShowTechniqueSelector(false);
    
    // Scroll to tasks section after creating task
    setTimeout(() => {
      const tasksSection = document.getElementById('tasks-section');
      if (tasksSection) {
        tasksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, [titleInput, minutesInput, selectedTechnique, userStats]);

  const startTask = useCallback((id: string) => {
    setActiveId(id);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: 'active' as const, paused: false } : task
      )
    );
    // Timer will be started by the useEffect
  }, []);

  const togglePause = useCallback((id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          const newPaused = !task.paused;
          return { ...task, paused: newPaused };
        }
        return task;
      })
    );
    // Timer will be managed by the useEffect
  }, []);

  const completeTask = useCallback((id: string, victoryNote: string = '') => {
    setTasks((prevTasks) => {
      const task = prevTasks.find(t => t.id === id);
      if (!task) return prevTasks;

      setCompletionParticles({ technique: task.breathingTechnique, active: true });
      setTimeout(() => {
        setCompletionParticles(null);
      }, 3000);

      return prevTasks.map((task) =>
        task.id === id ? { 
          ...task, 
          status: 'done' as const, 
          paused: true, 
          victoryNote,
          completedAt: new Date()
        } : task
      );
    });

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

  const giveUpTask = useCallback((id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: 'failed' as const, paused: true } : task
      )
    );
    setActiveId(null);
    stopTimer();
  }, [stopTimer]);

  const resetSession = useCallback(() => {
    stopTimer();
    setTasks([]);
    setActiveId(null);
    setFocusMode(false);
    setShowStats(false);
    setShowTechniqueSelector(false);
    nextTaskId.current = 0;
  }, [stopTimer]);

  // Effect to manage timer based on active task state
  useEffect(() => {
    const activeTask = tasks.find(t => t.id === activeTaskId);
    
    if (activeTask && activeTask.status === 'active' && !activeTask.paused) {
      // Start timer if not already running
      if (!timerRef.current) {
        startTimer();
      }
    } else {
      // Stop timer if no active unpaused task
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [activeTaskId, tasks, startTimer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Keyboard shortcuts
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
  }, [activeTaskId, addTask, togglePause, completeTask, giveUpTask, focusMode]);

  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const activeTasks = tasks.filter(t => t.status === 'active').length;
  const failedTasks = tasks.filter(t => t.status === 'failed').length;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background Layer */}
      <BackgroundLayer 
        activeTechnique={activeTaskId ? tasks.find(t => t.id === activeTaskId)?.breathingTechnique : undefined}
        season="spring"
        timeOfDay="day"
      />

      {/* Completion Particle Effects */}
      {completionParticles && (
        <ParticleSystem
          technique={completionParticles.technique}
          isActive={completionParticles.active}
          trigger="completion"
          intensity="high"
          onComplete={() => setCompletionParticles(null)}
        />
      )}

      {/* Main Container */}
      <div className="relative z-10 min-h-screen p-6">
        {/* Enhanced Header with Demon Slayer Theme */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="glass-soft rounded-3xl p-8 fade-in-up">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
                style={{ background: getTechniqueTheme(selectedTechnique).colors.gradient }}>
                <span className="text-3xl font-black text-white kanji-text">
                  {getTechniqueTheme(selectedTechnique).kanji}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Demon Slayer Focus
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Master your focus through the breathing techniques of the Demon Slayer Corps
              </p>
              {userStats && (
                <div className="mt-4 flex items-center justify-center space-x-4">
                  <div className="rank-badge current px-4 py-2 rounded-full">
                    <span className="text-sm font-bold">
                      {userStats.currentRank.toUpperCase()} RANK
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {Object.values(userStats.masteryByTechnique).reduce((total, stats) => total + stats.masteryPoints, 0)} mastery points
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Task Creation */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    What mission will you undertake?
                  </label>
                  <input
                    id="task-input"
                    type="text"
                    placeholder="Master the art of focused breathing..."
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="input-soft w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Focus Duration (min)
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Technique
                  </label>
                  <button
                    onClick={() => setShowTechniqueSelector(!showTechniqueSelector)}
                    className="btn-soft w-full h-12"
                    style={{ 
                      background: getTechniqueTheme(selectedTechnique).colors.gradient,
                      color: 'white'
                    }}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span className="text-lg">{getTechniqueTheme(selectedTechnique).kanji}</span>
                      <span className="text-sm">{getTechniqueTheme(selectedTechnique).name.split(' ')[0]}</span>
                    </span>
                  </button>
                </div>
                <div className="md:col-span-3">
                  <button
                    onClick={addTask}
                    className="btn-soft btn-primary w-full h-12"
                    disabled={!titleInput.trim()}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>⚔️</span>
                      <span>Begin Training</span>
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Technique Selector Modal */}
              {showTechniqueSelector && (
                <div className="mt-8">
                  <TechniqueSelector
                    selectedTechnique={selectedTechnique}
                    onSelect={(technique) => {
                      setSelectedTechnique(technique);
                      setShowTechniqueSelector(false);
                    }}
                  />
                </div>
              )}
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
                  <div className="text-sm font-medium text-gray-600">Total Tasks</div>
                  <div className="status-dot status-pending mx-auto"></div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black text-green-500">{completedTasks}</div>
                  <div className="text-sm font-medium text-gray-600">Completed</div>
                  <div className="status-dot status-done mx-auto"></div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black text-blue-500">{activeTasks}</div>
                  <div className="text-sm font-medium text-gray-600">Active</div>
                  <div className="status-dot status-active mx-auto"></div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black text-red-400">{failedTasks}</div>
                  <div className="text-sm font-medium text-gray-600">Failed</div>
                  <div className="status-dot status-failed mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Task Display */}
        <div id="tasks-section" className="max-w-7xl mx-auto">
          {tasks.length === 0 ? (
            <div className="text-center py-20">
              <div className="glass-card rounded-3xl p-16 max-w-2xl mx-auto fade-in-up">
                <div className="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center"
                  style={{ background: getTechniqueTheme(selectedTechnique).colors.gradient }}>
                  <span className="text-4xl font-black text-white kanji-text">
                    {getTechniqueTheme(selectedTechnique).kanji}
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-800">Ready to Begin Training?</h3>
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  Choose your breathing technique and embark on your journey to become a master of focus
                </p>
                <div className="text-center">
                  <div className="inline-block p-4 bg-gray-50 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-2">Selected Technique:</p>
                    <p className="font-bold text-lg" style={{ color: getTechniqueTheme(selectedTechnique).colors.primary }}>
                      {getTechniqueTheme(selectedTechnique).kanji} {getTechniqueTheme(selectedTechnique).name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getTechniqueTheme(selectedTechnique).description}
                    </p>
                  </div>
                </div>
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
                  
                  {/* Continuous particle effects for active tasks */}
                  {task.id === activeTaskId && task.status === 'active' && !task.paused && (
                    <ParticleSystem
                      technique={task.breathingTechnique}
                      isActive={true}
                      trigger="continuous"
                      intensity="low"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
          <button
            onClick={() => setShowStats(!showStats)}
            className={`
              rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300
              ${showStats 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
              }
            `}
            title="View Stats & Rank"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (activeTaskId) {
                setFocusMode(!focusMode);
              }
            }}
            className={`
              rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300
              ${focusMode 
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
              }
              ${!activeTaskId ? 'opacity-50' : ''}
            `}
            title={activeTaskId ? "Focus Mode" : "No active task"}
            disabled={!activeTaskId}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset all tasks? This cannot be undone.')) {
                resetSession();
              }
            }}
            className="
              bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300 hover:text-red-600
              rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300
            "
            title="Reset Session"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Stats Dashboard Modal */}
        {showStats && userStats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
              <div className="sticky top-0 bg-white rounded-t-3xl p-6 border-b border-gray-200 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-800">Demon Slayer Corps Status</h2>
                <button
                  onClick={() => setShowStats(false)}
                  className="
                    bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800
                    rounded-full w-12 h-12 flex items-center justify-center
                    transition-all duration-200 shadow-md hover:shadow-lg
                  "
                  title="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <StatsRankDashboard userStats={userStats} />
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Focus Mode Overlay */}
        {focusMode && activeTaskId && (
          <div className="fixed inset-0 backdrop-blur-3xl flex items-center justify-center z-50 p-8"
               style={{ 
                 background: `linear-gradient(135deg, ${getTechniqueTheme(tasks.find(t => t.id === activeTaskId)?.breathingTechnique || 'water').colors.background}80, rgba(255,255,255,0.9))` 
               }}>
            <div className="max-w-2xl w-full relative">
              {tasks.filter(t => t.id === activeTaskId).map(task => (
                <div key={task.id} className="transform scale-110 relative">
                  <TaskCard
                    task={task}
                    onStart={startTask}
                    onDone={completeTask}
                    onGiveUp={giveUpTask}
                    onTogglePause={togglePause}
                    isActive={true}
                  />
                  
                  {/* Enhanced particle effects in focus mode */}
                  {task.status === 'active' && !task.paused && (
                    <ParticleSystem
                      technique={task.breathingTechnique}
                      isActive={true}
                      trigger="continuous"
                      intensity="medium"
                    />
                  )}
                </div>
              ))}
              
              {/* Breathing instruction overlay */}
              {tasks.find(t => t.id === activeTaskId)?.status === 'active' && (
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="bg-white bg-opacity-90 rounded-2xl p-4 shadow-lg">
                    <p className="text-sm text-gray-600 mb-1">Focus on your breathing</p>
                    <p className="font-semibold" style={{ color: getTechniqueTheme(tasks.find(t => t.id === activeTaskId)?.breathingTechnique || 'water').colors.primary }}>
                      Inhale {getTechniqueTheme(tasks.find(t => t.id === activeTaskId)?.breathingTechnique || 'water').effects.breathingPattern.inhale}s - Hold {getTechniqueTheme(tasks.find(t => t.id === activeTaskId)?.breathingTechnique || 'water').effects.breathingPattern.hold}s - Exhale {getTechniqueTheme(tasks.find(t => t.id === activeTaskId)?.breathingTechnique || 'water').effects.breathingPattern.exhale}s
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setFocusMode(false)}
              className="absolute top-8 right-8 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;