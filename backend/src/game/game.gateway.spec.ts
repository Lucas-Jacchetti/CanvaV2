//*CLASSE DE TESTES

import { Test } from "@nestjs/testing";
import { GameGateway } from "./game.gateway";
import { INestApplication } from "@nestjs/common";
import { Socket, io } from "socket.io-client";

async function createNestApp(...gateways: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({ //recebe a gateway/provider e retorna um app nest 
    providers: gateways,
  }).compile();
  return testingModule.createNestApplication();
}

describe("GameGateway", () => {
  let gateway: GameGateway;
  let app: INestApplication;
  let ioClient: Socket;

  beforeAll(async () => {
    app = await createNestApp(GameGateway); //antes de tudo, recebe a gateway/provider e retorna um app nest 
    gateway = app.get<GameGateway>(GameGateway); //pega o gamegateway 
    ioClient = io("http://localhost:3000", { //o local de conexão vair ser localhost3000, mas nao conecta direto pq autoconnect é false
      autoConnect: false, //impede de conectar automaticamente
      transports: ["websocket", "polling"],
    });

    app.listen(3000);
  });

  

  it("should be defined", () => { //primeiro teste, checa se a instancia gateway (= gamegateway) existe
    expect(gateway).toBeDefined();
  });

  it('should emit "pong" on "ping"', async () => { //testa se o servidor responde a um evento 'ping' com 'pong'
    ioClient.connect(); //conecta no webSocket
    ioClient.emit("ping", "pingpong"); //emite o ping
    await new Promise<void>((resolve) => { //espera a resposta 
      ioClient.on("connect", () => {
        console.log("connected");
      });
      ioClient.on("pong", (data) => {
        expect(data).toBe("pingpong"); //checa se o pong recebido é igual ao ping
        resolve();
      });
    });
    ioClient.disconnect(); //desconecta o cliente
  });

  afterAll(async () => {
    await app.close(); //fecha a aplicação
  });
});