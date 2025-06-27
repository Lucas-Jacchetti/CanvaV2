import { Player } from "./player.type";
import { Obstacle } from "./obstacle.type";

export interface GameState { //objeto com todos os jogadores conectados, usando o id do socket como chave
    players: Record<string, Player>;
    obstacles: Obstacle[];
}

// { ex de dado:
//   players: {
//     "socket1": { id: "socket1", x: 100, y: 200, startTime: 1719420000, finished: false },
//     "socket2": { id: "socket2", x: 150, y: 180, startTime: 1719420010, finished: true, finishTime: 5200 }
//   }
// }