import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do CORS
  app.enableCors({
    origin: '*',
    credentials: true
  });

  // Configuração do WebSocket
  const httpAdapter = app.getHttpAdapter();
  const io = require('socket.io')(httpAdapter.getInstance(), {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    path: '/socket.io'
  });

  // Tratamento de shutdown
  const server = await app.listen(process.env.PORT || 8080, '0.0.0.0');
  
  // Keep-alive para o health check
  setInterval(() => {
    server.getConnections((err, count) => {
      if (err) console.error('Health check error:', err);
      else console.log(`Active connections: ${count}`);
    });
  }, 5000);

  console.log(`App started on port ${process.env.PORT || 8080}`);
}

bootstrap().catch(err => {
  console.error('Bootstrap error:', err);
  process.exit(1);
});