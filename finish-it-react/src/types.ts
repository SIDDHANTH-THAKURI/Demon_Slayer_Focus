export type TaskStatus = 'pending' | 'active' | 'done' | 'failed';

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
}