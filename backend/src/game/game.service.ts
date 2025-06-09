import { Injectable } from '@nestjs/common';

interface Player { //cria uma inerface para definir as propiedades do player
    id: string;
    x: number;
    y: number;
    color: string;
}

@Injectable()
export class GameService {
    jumpPlayer(id: string) {
        throw new Error("Method not implemented.");
    }
    private players: Record<string, Player> = {};

    addPlayer(id: string) { //adiciona um jogador, atribuindo uma posição e cor aleatorias
        this.players[id] = {
        id,
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        color: this.randomColor(),
        };
    }

    removePlayer(id: string) {
        delete this.players[id]; //deleta o jogador do vetor
    }

    movePlayer(id: string, direction: string) {//movimentação do jogador
        const speed = 5; //velocidade é 5
        const player = this.players[id]; //o player será especifico por base de um id
        if (!player) return;

        if (direction === 'up') player.y -= speed;  //movimentação
        if (direction === 'down') player.y += speed;
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