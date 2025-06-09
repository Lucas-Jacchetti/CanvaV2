import { Injectable } from '@nestjs/common';

interface Player { //cria uma inerface para definir as propiedades do player
    id: string;
    x: number;
    y: number;
    vy: number;
    color: string;
    isJumping: boolean;
}

@Injectable()
export class GameService {
    
    private players: Record<string, Player> = {};

    addPlayer(id: string) { //adiciona um jogador, atribuindo uma posição e cor aleatorias
        this.players[id] = {
        id,
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        vy: 0,
        color: this.randomColor(),
        isJumping: false
        };
    }

    updatePhysics() {
        const gravity = 1;
        const groundY = 550;

        for (const player of Object.values(this.players)) {
            if (player.isJumping) {
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
        const player = this.players[id]

        if (!player || player.isJumping) return;

        player.vy = -15; // impulso para cima
        player.isJumping = true;
    }

    removePlayer(id: string) {
        delete this.players[id]; //deleta o jogador do vetor
    }

    movePlayer(id: string, direction: string) {//movimentação do jogador
        const speed = 5; //velocidade é 5
        const player = this.players[id]; //o player será especifico por base de um id
        if (!player) return;

        if (direction === 'left') player.x -= speed;
        if (direction === 'right') player.x += speed;

        // Limita área do canvas (opcional)
        player.x = Math.max(0, Math.min(770, player.x));
        player.y = Math.max(0, Math.min(570, player.y));
    }

    getGameState() {
        return this.players; //retorna o estado
    }

    private randomColor(): string {
        return `hsl(${Math.random() * 360}, 70%, 50%)`; //retorna uma cor aleatoria
    }
}