export interface Player{
    id: String;
    x: number;
    y: number;
    vy: number;
    isJumping: boolean;
    startTime: number;
    finished?: boolean;
    finishTime?: number;
} 