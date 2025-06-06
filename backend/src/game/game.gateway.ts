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
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  constructor(private gameService: GameService) {}

  handleConnection(client: Socket) {
    this.gameService.addPlayer(client.id); // adiciona jogador ao estado
    client.emit('init', this.gameService.getGameState()); // envia estado atual para ele
    client.broadcast.emit('newPlayer', { id: client.id }); // avisa aos outros que um novo jogador entrou
  }

}
