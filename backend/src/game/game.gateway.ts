import { Server, Socket } from "socket.io";
import {
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
    this.gameService.addPlayer(client.id); // adiciona jogador ao estado
    client.emit('init', this.gameService.getGameState()); // envia estado atual para ele
    client.broadcast.emit('newPlayer', { id: client.id }); // avisa aos outros que um novo jogador entrou
  }

    handleDisconnect(client: Socket) { //gerencia a said a de um novo jogador
    this.gameService.removePlayer(client.id); // remove jogador do estado
    client.broadcast.emit('playerLeft', client.id); // avisa aos outros jogadores
  }


}
