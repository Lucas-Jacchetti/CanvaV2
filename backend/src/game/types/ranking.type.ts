export interface RankingEntry {
    playerId: string;
    playerName: string;
    time: number;
}

export interface Ranking {
    roomId: string;
    players: RankingEntry[];
}
