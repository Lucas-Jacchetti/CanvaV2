import { Server, Socket } from "socket.io";
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";

@WebSocketGateway({ cors: true }) //escuta e responde a eventos de WebSocket
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{ //interfaces para lidar com entrada e saida de jogadores
  constructor(private gameService: GameService) {}

  private readonly logger = new Logger(GameGateway.name); // logger para registrar eventos
  afterInit() {
    this.logger.log("Initialized"); //indica que o gateway foi inicializado
  }

  handleConnection(client: Socket) { //gerencia a conexãod de um novo jogador
    this.logger.log(`Client connected: ${client.id}`); //log temporario para registrar a conexão
    
    this.gameService.addPlayer(client.id); // adiciona jogador ao estado
    client.emit('init', this.gameService.getGameState()); // envia estado atual para ele
    client.broadcast.emit('newPlayer', { id: client.id }); // avisa aos outros que um novo jogador entrou
  }

  handleDisconnect(client: Socket) { //gerencia a saidaa de um novo jogador
    this.logger.log(`Client disconnected: ${client.id}`); //log temporario para registrar a desconexão

    this.gameService.removePlayer(client.id); // remove jogador
    client.broadcast.emit('playerLeft', client.id); 
  }

    @SubscribeMessage('jump')
    handleJump(@ConnectedSocket() client: Socket) { //*arrumar parametros eu acho
      this.gameService.jumpPlayer(client.id);

      const state = this.gameService.getGameState();
      client.broadcast.emit('state', state);
    }

}
