export type TaskStatus = 'pending' | 'active' | 'done' | 'failed';

export type BreathingTechnique = 
  | 'water' | 'flame' | 'thunder' | 'insect' 
  | 'stone' | 'wind' | 'mist' | 'serpent' 
  | 'flower' | 'sound' | 'love' | 'sun';

export type RankLevel = 
  | 'mizunoto' | 'mizunoe' | 'kanoto' | 'kanoe' 
  | 'tsuchinoto' | 'tsuchinoe' | 'hinoto' | 'hinoe' 
  | 'kinoto' | 'kinoe' | 'hashira';

export type PatternType = 
  | 'asanoha' | 'seigaiha' | 'hemp-leaf' | 'flame-pattern' 
  | 'lightning-pattern' | 'butterfly-pattern' | 'rock-pattern' 
  | 'wind-swirl' | 'mist-pattern' | 'snake-scale' 
  | 'sakura-pattern' | 'sound-wave' | 'heart-pattern' | 'sun-ray';

export interface TechniqueTheme {
  name: string;
  kanji: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
    text: string;
    background: string;
  };
  patterns: {
    background: PatternType;
    border: string;
    particle: string;
  };
  effects: {
    animation: string;
    sound: string;
    completion: string;
    breathingPattern: {
      inhale: number;
      hold: number;
      exhale: number;
    };
  };
  tsuba: {
    style: string;
    innerPattern: string;
    decorativeElements: string[];
  };
}

export interface Task {
    id: string;
    title: string;
    initialMinutes: number;
    remainingTime: number; // in milliseconds
    status: TaskStatus;
    paused: boolean;
    sprints: number; // for micro-sprints
    sprintProgress: number;
    sprintSec?: number; // sprint duration in seconds
    sprintTicks?: number; // completed sprints
    victoryNote?: string;
    breathingTechnique: BreathingTechnique;
    masteryLevel: number; // 1-10 scale
    createdAt: Date;
    completedAt?: Date;
    techniqueStats?: TechniqueStats;
}

export interface TechniqueStats {
  totalTime: number; // total time spent with this technique
  completedTasks: number;
  averageCompletion: number; // percentage
  masteryPoints: number;
  rank: RankLevel;
}

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  totalFocusTime: number;
  currentRank: RankLevel;
  masteryByTechnique: Record<BreathingTechnique, TechniqueStats>;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  technique?: BreathingTechnique;
}

export interface ParticleEffect {
  type: string;
  count: number;
  colors: string[];
  animation: string;
  duration: number;
}