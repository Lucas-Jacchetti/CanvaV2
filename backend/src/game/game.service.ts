import { Injectable } from '@nestjs/common';
import { Player } from './types/player.type';
import { GameState } from './types/game-state.type';
@Injectable()
export class GameService {
    private state: GameState = {
        players: {},
        obstacles: [
            { id: 'obs1', x: 100, y: 100, width: 100, height: 20 },
            { id: 'obs2', x: 250, y: 200, width: 100, height: 20 },
            { id: 'obs3', x: 150, y: 300, width: 100, height: 20 },
        ]
    };

    checkCollision(playerX: number, playerY: number ): boolean{
        for (const obs of this.state.obstacles) {
            const withinX = playerX >= obs.x && playerX <= obs.x + obs.width;
            const withinY = playerY >= obs.y && playerY <= obs.y + obs.height;
            if (withinX && withinY) {
            return true;
            }
        }
        return false;
    }

    addPlayer(id: string, name: string) { //adiciona um jogador, atribuindo informações pré definidas na interface
        const newPlayer: Player = {
        id,
        name,
        x: 200,
        y: 490,
        vy: 0,
        isJumping: false,
        startTime: Date.now(),
        finished: false
        };
        this.state.players[id] = newPlayer;
    }

    getPlayer(id: string): Player {
        const player = this.state.players[id];
        if (!player) throw new Error(`Player ${id} not found`);
        return player;
    }   

    removePlayer(id: string) {
        delete this.state.players[id]; //deleta o jogador do vetor
    }

    restartPlayer(id: string){
        const player = this.state.players[id];

        if (!player) return;

        player.x = 200;
        player.y = 490;
        player.vy = 0;
        player.isJumping = false;
        player.startTime = Date.now();
        player.finished = false;
        player.finishTime = undefined;
    }

    updatePhysics() { //chamada em um loop de atualização
        const gravity = 1;
        const groundY = 500;

        for (const player of Object.values(this.state.players)) {
            if (player.isJumping) {
            player.vy += gravity; //acelera para baixo (velocidade vertical incrementa conforme o valor da gravidade)
            const nextY = player.vy + player.y; //criação de uma variavel pra simular a movimentação do jogador, a fim de evitar bugs (mover o jogador após todas as checagens)
                
                if (nextY >= groundY) { //se o player tocar no chão, reseta td
                    player.y = groundY; 
                    player.vy = 0;
                    player.isJumping = false;
                    continue;
                }

                if (this.checkCollision(player.x, nextY)) {
                    player.vy = 0;
                    player.isJumping = false;
                }

                player.y = nextY;
            }
        }
    }

    jumpPlayer(id: string) {
        const player = this.state.players[id]

        if (!player || player.isJumping) return;

        player.vy = -15; // impulso para cima
        player.isJumping = true;
    }

    movePlayer(id: string, data: { x: number; y: number }) {
        const player = this.state.players[id];
        if (!player) return;

        player.x += data.x;
        player.y += data.y;
    }

    checkFinish(id: string): number | null{
        const player = this.state.players[id];

        if (!player || player.finished) return null
            
        player.finished = true;
        const time = Date.now() - player.startTime;
        player.finishTime = time;
        console.log(`Jogador ${id} finalizou em ${time}ms`);
        
        return time;
        
    }

    resetGame(){
        for (const id in this.state.players){
            this.restartPlayer(id);
        }
    }

    getGameState() {
        return this.state; //retorna o estado
    }

    
}