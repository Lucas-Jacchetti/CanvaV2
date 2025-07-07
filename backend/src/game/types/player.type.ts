export interface Player{
    id: string;
    name: string;
    x: number;
    y: number;
    vy: number;
    vx: number;
    isJumping: boolean;
    startTime: number;
    finished?: boolean;
    finishTime?: number;
} 