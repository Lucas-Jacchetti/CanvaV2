export interface RankingEntry {
    playerId: string;
    time: number;
}

export interface Ranking {
    roomId: string;
    players: RankingEntry[];
}
