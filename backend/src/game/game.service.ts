import { Injectable } from '@nestjs/common';
import { Player } from './types/player.type';
import { GameState } from './types/game-state.type';
@Injectable()
export class GameService {
    private state: GameState = {
        players: {}
    };
    

    addPlayer(id: string) { //adiciona um jogador, atribuindo informações pré definidas na interface
        const newPlayer: Player = {
        id,
        x: 200,
        y: 1,
        vy: 0,
        isJumping: false,
        startTime: Date.now(),
        finished: false
        };
        this.state.players[id] = newPlayer;
    }

    removePlayer(id: string) {
        delete this.state.players[id]; //deleta o jogador do vetor
    }

    updatePhysics() {
        const gravity = 1;
        const groundY = 550;

        for (const player of Object.values(this.state.players)) {
            if (this.state.players.isJumping) {
            player.vy += gravity;
            player.y += player.vy;
                if (player.y >= groundY) {
                    player.y = groundY;
                    player.vy = 0;
                    player.isJumping = false;
                }
            }
        }
    }

    jumpPlayer(id: string) {
        const player = this.state.players[id]

        if (!player || player.isJumping) return;

        player.vy = -15; // impulso para cima
        player.isJumping = true;
    }

    movePlayer(id: string, data: { dx: number; dy: number }) {
    const player = this.state.players[id];
    if (!player) return;

    player.x += data.dx;
    player.y += data.dy;

    // Verifica se chegou no topo (linha de chegada)
    if (player.y <= 0) {
        const time = Date.now() - player.startTime;
        console.log(`Jogador ${id} finalizou em ${time}ms`);
    }
    }

    getGameState() {
        return this.state.players; //retorna o estado
    }

    
}