export type TaskStatus = 'running' | 'won' | 'lost'


export interface Task {
    id: string;
    title: string;
    initialMinutes: number;
    remainingTime: number; // in milliseconds
    status: 'pending' | 'active' | 'done' | 'failed';
    paused: boolean;
    sprints: number; // for micro-sprints
    sprintProgress: number;
    victoryNote?: string;
}