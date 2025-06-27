import { Injectable } from "@nestjs/common";
import { RankingEntry } from "./types/ranking.type";

@Injectable()
export class rankingService{
    private ranking: RankingEntry[] = [];


    save(playerId: string, time: number){
        this.ranking.push({playerId, time})
        this.ranking.sort((a, b) => a.time - b.time); //menor tempo 1°
    }

    getTop(limit = 10): RankingEntry[] { //pega os 10 mais rapidos
        return this.ranking.slice(0, limit);
    }

    getAll(): RankingEntry[] { //pega todos
        return [...this.ranking]; // cópia do array
    } 

    clear() {
        this.ranking = [];
    }
}