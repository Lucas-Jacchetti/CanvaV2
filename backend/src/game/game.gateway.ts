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

@WebSocketGateway({ cors: true }) //escuta e responde a eventos de WebSocket
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{ //interfaces para lidar com entrada e saida de jogadores
  constructor(
    private gameService: GameService, private rankingService: RankingService) {}

    private readonly logger = new Logger(GameGateway.name); // logger para registrar eventos
    afterInit() {
      this.logger.log("Initialized"); //indica que o gateway foi inicializado
    }

    @SubscribeMessage('join')
    handleConnection(@ConnectedSocket() client: Socket, @MessageBody() data: { name?: string }) { //gerencia a conexãod de um novo jogador
      this.logger.log(`Client connected: ${client.id}`); //log temporario para registrar a conexão
      const name = data?.name ?? "Anônimo";
      
      const gameState = this.gameService.getGameState();
      console.log("Sending game state:", gameState);
      
      this.gameService.addPlayer(client.id, name); // adiciona jogador ao estado
      client.emit('init', this.gameService.getGameState()); // envia estado atual para ele
      client.broadcast.emit('newPlayer', { id: client.id }); // avisa aos outros que um novo jogador entrou
    }

    @SubscribeMessage('disconnect')
    handleDisconnect(@ConnectedSocket() client: Socket) { //gerencia a saidaa de um novo jogador
      this.logger.log(`Client disconnected: ${client.id}`); //log temporario para registrar a desconexão

      this.gameService.removePlayer(client.id); // remove jogador
      client.broadcast.emit('playerLeft', client.id); 
    }

    @SubscribeMessage('move')
    handleMove(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: { x: number, y: number }
    ){
      this.gameService.movePlayer(client.id, data);

      const player = this.gameService.getPlayer(client.id);
      const finishTime = this.gameService.checkFinish(client.id);

      if (finishTime !== null) {
        this.rankingService.save(player.id, finishTime, player.name);
        client.emit('playerFinished', { time: finishTime });
        this.server.emit('rankingUpdate', this.rankingService.getTop(10));
      }

      this.server.emit('state', this.gameService.getGameState())

    }

    @SubscribeMessage('restart')
    handleRestart(@ConnectedSocket() client: Socket){
      this.gameService.restartPlayer(client.id)
      this.server.emit('state', this.gameService.getGameState());
    }

    @SubscribeMessage('restartGame')
    handleRestartGame(){
      this.gameService.resetGame()
      this.server.emit('state', this.gameService.getGameState())
    }

    @SubscribeMessage('jump')
    handleJump(@ConnectedSocket() client: Socket){
      this.gameService.jumpPlayer(client.id)
      this.server.emit('state', this.gameService.getGameState())
    }

    @WebSocketServer() server: Server;
    onModuleInit() { //loop de atualização do jogo
        setInterval(() => {
        this.gameService.updatePhysics();
        this.server.emit('state', this.gameService.getGameState());
      }, 1000 / 60); // 60 FPS
    }
}
