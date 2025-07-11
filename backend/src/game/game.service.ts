import { Injectable } from '@nestjs/common';
import { Player } from './types/player.type';
import { GameState } from './types/game-state.type';

@Injectable()
export class GameService {
    private readonly PHYSICS = {
        GRAVITY: 1,
        JUMP_FORCE: -15,
        MOVE_SPEED: 3,
        FRICTION: 0.9,
        PLAYER_RADIUS: 10,
        GROUND_Y: 490
    };

    private games: {[roomId: string]: GameState} =  {};

    createGame(roomId: string, name: string, playerId: string){
        this.games[roomId] = {
            players: {
                [playerId]: {
                    id: playerId,
                    name,
                    x: 200,
                    y: 350,
                    vy: 0,
                    vx: 0,
                    isJumping: false,
                    startTime: Date.now(),
                    finished: false
                }
            },
            obstacles: [
                { id: 'obs1', x: 100, y: 100, width: 100, height: 20 },
                { id: 'obs2', x: 250, y: 200, width: 100, height: 20 },
                { id: 'obs3', x: 150, y: 300, width: 100, height: 20 },
                { id: 'obs4', x: 150, y: 450, width: 100, height: 20 },
                { id: 'obs5', x: 150, y: 480, width: 100, height: 20 },
                { id: 'obs6', x: 75, y: 375, width: 100, height: 20 },
            ]
        }
    }

    addPlayer(roomId: string, id: string, name: string) {
        const newPlayer: Player = {
            id,
            name,
            x: 200,
            y: 350,
            vy: 0,
            vx: 0,
            isJumping: false,
            startTime: Date.now(),
            finished: false
        };
        this.games[roomId].players[id] = newPlayer;
        console.log(`[GameService] ✅ Jogador adicionado: ${id} na sala ${roomId}`);
    }

    getPlayer(roomId: string, id: string): Player {
        const player = this.games[roomId]?.players[id];
        if (!player) throw new Error(`Player ${id} not found`);
        return player;
    }

    removePlayer(roomId: string, id: string) {
        const room = this.games[roomId];
        if (!room) return;

        delete room.players[id];

        if(Object.keys(room.players).length === 0){
            delete this.games[roomId]
        }
    }

    restartPlayer(roomId: string, id: string) {
        const player = this.games[roomId]?.players[id];
        if (!player) return;

        player.x = 200;
        player.y = 350;
        player.vy = 0;
        player.vx = 0;
        player.isJumping = false;
        player.startTime = Date.now();
        player.finished = false;
        player.finishTime = undefined;
    }

    updatePhysics(roomId: string) {
        const game = this.games[roomId];
        if (!game) return;
        
        for (const player of Object.values(this.games[roomId].players)) {
            if (!player.isJumping){
                this.applyGravity(player);
            }
            this.applyGravity(player);
            this.applyFriction(player)
            
            const nextY = player.y + player.vy;
            const nextX = player.x + player.vx;
                
            const xCollided = this.detectHorizontalCollision(game, player, nextX);
            if (!xCollided) player.x = nextX;

            if (this.detectGroundCollision(player, nextY)) continue;

            const yCollided = this.detectVerticalCollision(game, player, nextY);
            if (!yCollided) player.y = nextY;
        }
    }

    private applyGravity(player: Player) {
        player.vy += this.PHYSICS.GRAVITY;
    }

    private applyFriction(player: Player) {
        player.vx *= this.PHYSICS.FRICTION;
        if (Math.abs(player.vx) < 0.1) player.vx = 0;
    }

    private detectGroundCollision(player: Player, nextY: number): boolean {
        if (nextY >= this.PHYSICS.GROUND_Y) {
            player.y = this.PHYSICS.GROUND_Y;
            player.vy = 0;
            player.isJumping = false;
            return true;
        }
        return false;
    }

    private detectHorizontalCollision(game: GameState, player: Player, nextX: number): boolean {
        const r = this.PHYSICS.PLAYER_RADIUS;
        for (const obs of game.obstacles) {
            const withinY = player.y + r >= obs.y && player.y - r <= obs.y + obs.height;

            if (player.vx > 0 && player.x + r <= obs.x && nextX + r >= obs.x && withinY) {
                player.x = obs.x - r;
                player.vx = 0;
                return true;
            }
            if (player.vx < 0 && player.x - r >= obs.x + obs.width && nextX - r <= obs.x + obs.width && withinY) {
                player.x = obs.x + obs.width + r;
                player.vx = 0;
                return true;
            }
        }
        return false;
    }

    private detectVerticalCollision(game: GameState, player: Player, nextY: number): boolean {
        const r = this.PHYSICS.PLAYER_RADIUS;
        for (const obs of game.obstacles) {
            const withinX = player.x + r >= obs.x && player.x - r <= obs.x + obs.width;

            if (player.vy > 0 && player.y + r <= obs.y && nextY + r >= obs.y && withinX) {
                player.y = obs.y - r;
                player.vy = 0;
                player.isJumping = false;
                return true;
            }
            if (player.vy < 0 && player.y - r >= obs.y + obs.height && nextY - r <= obs.y + obs.height && withinX) {
                player.y = obs.y + obs.height + r;
                player.vy = 0;
                return true;
            }
        }
        return false;
    }

    jumpPlayer(roomId: string, id: string) {
        const player = this.games[roomId]?.players[id];
        if (!player || player.isJumping) return;

        player.vy = this.PHYSICS.JUMP_FORCE;
        player.isJumping = true;
    }

    movePlayer(roomId: string, id: string, data: { x: number, y: number }) {
        const player = this.games[roomId]?.players[id];
        if (!player) return;

        player.vx = data.x * this.PHYSICS.MOVE_SPEED;   
        
    }   

    checkFinish(roomId: string, id: string): number | null {
        const player = this.games[roomId]?.players[id];
        if (!player || player.finished) return null;

        if (player.y <= 8) {
            player.finished = true;
            const time = Date.now() - player.startTime;
            player.finishTime = time;
            return time;

        }
        return null;
    }

    resetGame(roomId: string) {
        const game = this.games[roomId];
        if (!game) return;

        for (const id in game.players) {
            this.restartPlayer(roomId, id);
        }
    }

    setPlayerStartTime(roomId: string, playerId: string, startTime: number): void {
        const game = this.games[roomId];

        if (!game) {
            console.warn(`[GameService] Sala não encontrada: ${roomId}`);
            return;
        }

        if (!game.players || !game.players[playerId]) {
            console.warn(`[GameService] Jogador ${playerId} não encontrado na sala ${roomId}`);
            return;
        }

        game.players[playerId].startTime = startTime;
    }

    getGameState(roomId: string) : GameState | null{
        return this.games[roomId] ?? null;
    }
}