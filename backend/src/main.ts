import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do CORS para HTTP
  app.enableCors({
    origin: '*',
    credentials: true
  });

  // Obtenha a instância do servidor HTTP subjacente
  const httpServer = app.getHttpServer();

  // Configure o Socket.IO diretamente
  const io = require('socket.io')(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    path: '/socket.io'
  });

  await app.listen(process.env.PORT || 8080);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();