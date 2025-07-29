import { Injectable } from '@nestjs/common';
import { Player } from './types/player.type';
import { GameState } from './types/game-state.type';

@Injectable()
export class GameService {
    private readonly PHYSICS = { //valores da fisica por praticidade 
        GRAVITY: 1,
        JUMP_FORCE: -13,
        MOVE_SPEED: 3,
        FRICTION: 0.9,
        PLAYER_RADIUS: 10,
        GROUND_Y: 5000
    };

    private games: {[roomId: string]: GameState} =  {};

    createGame(roomId: string, name: string, playerId: string){ //jogo é criado com a posição do jogador e objetos
        this.games[roomId] = {
            players: {
                [playerId]: {
                    id: playerId,
                    name,
                    x: 80,
                    y: 350,
                    vy: 0,
                    vx: 0,
                    isJumping: false,
                    startTime: Date.now(),
                    finished: false
                }
            },
            obstacles: [
                { id: 'obs1', x: 75, y: 570, width: 10, height: 10 }, //spawnpoint

                //fase 1
                { id: 'obs1', x: 8, y: 30, width: 25, height: 550 }, //primeira barra vertical
                    { id: 'obs2', x: 33, y: 506, width: 15, height: 10 },
                    { id: 'obs2', x: 33, y: 374, width: 15, height: 10 },
                    { id: 'obs2', x: 33, y: 242, width: 15, height: 10 },
                    { id: 'obs2', x: 33, y: 111, width: 20, height: 10 },

                { id: 'obs3', x: 130, y: 180, width: 25, height: 402 }, //segunda barra vertical
                    { id: 'obs2', x: 115, y: 440, width: 15, height: 10 },
                    { id: 'obs2', x: 115, y: 308, width: 15, height: 10 },
                    { id: 'obs3', x: 130, y: 70, width: 25, height: 10 }, //ultima plataforma de cima

                { id: 'obs2', x: 115, y: 176, width: 810, height: 15 }, //barra horizontal maior de cima
                
                //fase 2
                //plataformas parkour de cima
                    { id: 'obs2', x: 175, y: 90, width: 20, height: 10 }, 
                    { id: 'obs2', x: 245, y: 20, width: 20, height: 10 }, 

                    { id: 'obs2', x: 290, y: 90, width: 20, height: 10 }, 
                    { id: 'obs2', x: 360, y: 20, width: 20, height: 10 }, 

                    { id: 'obs2', x: 405, y: 90, width: 20, height: 10 }, 
                    { id: 'obs2', x: 475, y: 20, width: 20, height: 10 }, 

                    { id: 'obs2', x: 510, y: 90, width: 20, height: 10 }, 
                    { id: 'obs2', x: 580, y: 20, width: 20, height: 10 }, 

                    { id: 'obs2', x: 625, y: 90, width: 20, height: 10 }, 
                    { id: 'obs2', x: 695, y: 20, width: 20, height: 10 },

                    { id: 'obs2', x: 740, y: 90, width: 20, height: 10 }, 
                    { id: 'obs2', x: 810, y: 20, width: 20, height: 10 },

                    { id: 'obs2', x: 855, y: 90, width: 20, height: 10 }, 
                    { id: 'obs2', x: 925, y: 20, width: 20, height: 171 }, //barra vertical lateral direita 1

                { id: 'obs2', x: 1050, y: 20, width: 20, height: 466 }, //barra vertical lateral direita 2
                { id: 'obs2', x: 1050, y: 560, width: 20, height: 530 }, //barra vertical lateral direita 2

                { id: 'obs2', x: 980, y: 330, width: 80, height: 10 }, //barra de apoio para fase 3
                { id: 'obs2', x: 980, y: 430, width: 80, height: 10 }, //barra de apoio para fase 3 (morte)

                //fase 3

                    { id: 'obs2', x: 155, y: 200, width: 50, height: 10 },  //prevenção do bug
                    { id: 'obs2', x: 195, y: 190, width: 10, height: 10 },  //prevenção do bug

                    //barra 1
                        { id: 'obs2', x: 270, y: 230, width: 60, height: 7 },
                        { id: 'obs2', x: 370, y: 230, width: 60, height: 7 },
                        { id: 'obs2', x: 470, y: 230, width: 60, height: 7 },
                        { id: 'obs2', x: 570, y: 230, width: 60, height: 7 },
                        { id: 'obs2', x: 670, y: 230, width: 60, height: 7 },
                        { id: 'obs2', x: 770, y: 230, width: 60, height: 7 },
                        { id: 'obs2', x: 870, y: 230, width: 60, height: 7 },

                        //impedimento vertical (direita para esquerda)
                            { id: 'obs2', x: 770, y: 237, width: 10, height: 40 },
                            { id: 'obs2', x: 470, y: 237, width: 10, height: 40 },
                    
                    //barra 2
                        { id: 'obs2', x: 320, y: 270, width: 60, height: 7 },
                        { id: 'obs2', x: 420, y: 270, width: 60, height: 7 },
                        { id: 'obs2', x: 520, y: 270, width: 60, height: 7 },
                        { id: 'obs2', x: 620, y: 270, width: 60, height: 7 },
                        { id: 'obs2', x: 720, y: 270, width: 60, height: 7 },
                        { id: 'obs2', x: 820, y: 270, width: 60, height: 7 },

                        //impedimento vertical (direita para esquerda)
                            { id: 'obs2', x: 620, y: 277, width: 10, height: 40 },
                            { id: 'obs2', x: 320, y: 277, width: 10, height: 40 },
                    
                    //barra 3
                        { id: 'obs2', x: 270, y: 310, width: 60, height: 7 },
                        { id: 'obs2', x: 370, y: 310, width: 60, height: 7 },
                        { id: 'obs2', x: 470, y: 310, width: 60, height: 7 },
                        { id: 'obs2', x: 570, y: 310, width: 60, height: 7 },
                        { id: 'obs2', x: 670, y: 310, width: 60, height: 7 },
                        { id: 'obs2', x: 770, y: 310, width: 60, height: 7 },
                        { id: 'obs2', x: 870, y: 310, width: 60, height: 7 },

                        //impedimento vertical (direita para esquerda)
                            { id: 'obs2', x: 820, y: 317, width: 10, height: 40 },
                            { id: 'obs2', x: 520, y: 317, width: 10, height: 40 },
                            { id: 'obs2', x: 320, y: 317, width: 10, height: 40 },
                    
                     //barra 4
                        { id: 'obs2', x: 320, y: 350, width: 60, height: 7 },
                        { id: 'obs2', x: 420, y: 350, width: 60, height: 7 },
                        { id: 'obs2', x: 520, y: 350, width: 60, height: 7 },
                        { id: 'obs2', x: 620, y: 350, width: 60, height: 7 },
                        { id: 'obs2', x: 720, y: 350, width: 60, height: 7 },
                        { id: 'obs2', x: 820, y: 350, width: 60, height: 7 },

                        //impedimento vertical (direita para esquerda)
                            { id: 'obs2', x: 720, y: 357, width: 10, height: 40 },
                            { id: 'obs2', x: 420, y: 357, width: 10, height: 40 },
                    
                    //barra 5
                        { id: 'obs2', x: 270, y: 390, width: 60, height: 7 },
                        { id: 'obs2', x: 370, y: 390, width: 60, height: 7 },
                        { id: 'obs2', x: 470, y: 390, width: 60, height: 7 },
                        { id: 'obs2', x: 570, y: 390, width: 60, height: 7 },
                        { id: 'obs2', x: 670, y: 390, width: 60, height: 7 },
                        { id: 'obs2', x: 770, y: 390, width: 60, height: 7 },
                        { id: 'obs2', x: 870, y: 390, width: 60, height: 7 },
                    
                { id: 'obs2', x: 330, y: 476, width: 730, height: 10 }, //barra fina entre fase 3 e 4                  
                { id: 'obs2', x: 330, y: 390, width: 15, height: 86 }, //barra fina entre fase 3 e 4                  
                { id: 'obs2', x: 155, y: 550, width: 50, height: 10 },  //barra de apoio para fase 4  
                
                //fase 4
                    { id: 'obs2', x: 290, y: 600, width: 6, height: 300 },    
                    { id: 'obs2', x: 360, y: 630, width: 5, height: 300 },    
                    { id: 'obs2', x: 410, y: 580, width: 20, height: 300 },    
                    { id: 'obs2', x: 500, y: 600, width: 9, height: 300 },    
                    { id: 'obs2', x: 570, y: 600, width: 6, height: 300 },    
                    { id: 'obs2', x: 620, y: 580, width: 7, height: 300 },    
                    { id: 'obs2', x: 690, y: 600, width: 20, height: 300 },    
                    { id: 'obs2', x: 760, y: 630, width: 8, height: 300 },    
                    { id: 'obs2', x: 830, y: 600, width: 6, height: 300 },    
                    { id: 'obs2', x: 890, y: 580, width: 8, height: 300 },    
                    { id: 'obs2', x: 960, y: 580, width: 8, height: 300 },    
                    { id: 'obs2', x: 1010, y: 630, width: 4, height: 300 },    

                //fase 5
                    { id: 'obs2', x: 1120, y: 520, width: 20, height: 10 }, //apoio fase 5

                    { id: 'obs2', x: 1070, y: 450, width: 20, height: 10 },
                    { id: 'obs2', x: 1070, y: 375, width: 15, height: 10 },
                    { id: 'obs2', x: 1070, y: 300, width: 15, height: 10 },
                    { id: 'obs2', x: 1070, y: 225, width: 15, height: 10 },
                    { id: 'obs2', x: 1070, y: 150, width: 15, height: 10 },

                    { id: 'obs2', x: 1150, y: 100, width: 15, height: 10 }, //pre-chegada
                    { id: 'obs2', x: 1230, y: 100, width: 15, height: 10 }, //pre-chegada
            ]
        }
    }

    addPlayer(roomId: string, id: string, name: string) {
        const newPlayer: Player = {
            id,
            name,
            x: 80,
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

        player.x = 80;
        player.y = 550;
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

    checkFinish(roomId: string, id: string): boolean {
        const player = this.games[roomId]?.players[id];
        if (!player || player.finished) return false;

        if (player.x >= 1300 && player.y < 600) {
            player.finished = true;
            const time = Date.now() - player.startTime;
            player.finishTime = time;
            return true;
        }
        return false;
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