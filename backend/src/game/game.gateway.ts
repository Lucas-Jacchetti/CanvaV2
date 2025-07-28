import { Server, Socket } from "socket.io";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { GameService } from "./game.service";
import { RankingService } from "./ranking.service";

@WebSocketGateway({
  namespace: '/',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
}) //escuta e responde a eventos de WebSocket
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{ //interfaces para lidar com entrada e saida de jogadores
  
  constructor(
    private gameService: GameService, private rankingService: RankingService) {}

    private readonly logger = new Logger(GameGateway.name); // logger para registrar eventos
    afterInit() {
      this.logger.log("Initialized"); //indica que o gateway foi inicializado
    }

    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }

    @SubscribeMessage('join')
    async handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { name?: string, roomId?: string}) { //gerencia a conexãod de um novo jogador
      if (!data?.roomId) {
        this.logger.error(`roomId ausente na conexão de ${client.id}`);
        client.disconnect();
        return;
      }
      
      const roomId = data.roomId;
      const name = data?.name ?? "Anônimo";

      client.data.roomId = roomId;
      client.join(roomId);
      
      const existingGame = this.gameService.getGameState(roomId);
      if (!existingGame) {
        this.gameService.createGame(roomId, name, client.id);
      } else {
        this.gameService.addPlayer(roomId, client.id, name);
      }      

      client.emit('init', this.gameService.getGameState(roomId)); // envia estado atual para ele
      client.to(roomId).emit('newPlayer', { id: client.id }); // avisa aos outros que um novo jogador entrou

      const topRanking = await this.rankingService.getTop(10);
      client.emit('rankingUpdate', topRanking);
    }

    @SubscribeMessage('disconnect')
    handleDisconnect(@ConnectedSocket() client: Socket) { //gerencia a saidaa de um novo jogador
      const roomId = client.data.roomId;
      if (!roomId) return;
      this.gameService.removePlayer(roomId, client.id); // remove jogador
      client.to(roomId).emit('playerLeft', client.id); 
    }

    @SubscribeMessage('startGame')
    handleStartGame(@ConnectedSocket() client: Socket) {
      const roomId = client.data.roomId;
      const playerId = client.id;   
      if (!roomId) {
        this.logger.warn(`[GameGateway] Sala ausente para cliente ${playerId}`);
        return;
      }
      const startTime = Date.now() + 3000;
      // Atualize o jogador com esse startTime
      this.gameService.setPlayerStartTime(roomId, client.id, startTime);
      // Envia para todos da sala
      this.server.to(roomId).emit('start', { startTime });
    }

    private async emitRankingUpdate(roomId: string) {
      const topRanking = await this.rankingService.getTop(10);
      this.server.to(roomId).emit('rankingUpdate', topRanking);
    }

    @SubscribeMessage('move')
    async handleMove(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: { x: number, y: number }
    ){
      const roomId = client.data.roomId;
      if (!roomId) return;
      this.gameService.movePlayer(roomId, client.id, data);

      // const player = this.gameService.getPlayer(roomId, client.id);
      // const finishTime = this.gameService.checkFinish(roomId, client.id);

      // if (finishTime !== null) {
      //   await this.rankingService.save(player.id, finishTime, player.name);
      //   client.emit('playerFinished', { time: finishTime });

      //   await this.emitRankingUpdate(roomId);
      // }

      this.server.to(roomId).emit('state', this.gameService.getGameState(roomId))

    }

    @SubscribeMessage('restart')
    handleRestart(@ConnectedSocket() client: Socket){
      const roomId = client.data.roomId;
      if (!roomId) return;

      this.gameService.restartPlayer(roomId, client.id)
      this.server.to(roomId).emit('state', this.gameService.getGameState(roomId));
    }

    @SubscribeMessage('restartGame')
    handleRestartGame(@ConnectedSocket() client: Socket){
      const roomId = client.data.roomId;
      if (!roomId) return;

      this.gameService.resetGame(roomId)
      this.server.to(roomId).emit('state', this.gameService.getGameState(roomId))
    }

    @SubscribeMessage('jump')
    handleJump(@ConnectedSocket() client: Socket){
      const roomId = client.data.roomId;
      if (!roomId) return;

      this.gameService.jumpPlayer(roomId, client.id)
      this.server.to(roomId).emit('state', this.gameService.getGameState(roomId))
    }

    @WebSocketServer() server: Server;
    onModuleInit() {
      setInterval(async () => {
        for (const roomId in this.gameService['games']) {
          this.gameService.updatePhysics(roomId);
          this.server.to(roomId).emit('state', this.gameService.getGameState(roomId));

          // 🔍 verificar jogadores finalizados
          for (const [playerId, player] of Object.entries(this.gameService.getGameState(roomId)?.players || {})) {
            const finished = this.gameService.checkFinish(roomId, playerId);
            if (finished) {
              const time = player.finishTime!;
              this.server.to(playerId).emit('playerFinished', { time });

              await this.rankingService.save(playerId, time, player.name);
              const topRanking = await this.rankingService.getTop(10);
              this.server.to(roomId).emit('rankingUpdate', topRanking);
            }
          }
        }
      }, 1000 / 60);
    }
}
