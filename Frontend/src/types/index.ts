export interface Player{
    id: string;
    name: string;
    x: number;
    y: number;
    vy: number;
    isJumping: boolean;
    startTime: number;
    finished?: boolean;
    finishTime?: number;
} 

export interface Obstacle{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface RankingEntry {
    playerId: string;
    playerName: string;
    time: number;
}

export interface Ranking {
    roomId: string;
    players: RankingEntry[];
}
