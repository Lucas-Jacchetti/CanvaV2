import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const httpAdapter = app.getHttpAdapter();
    
    // Configuração do CORS
    app.enableCors({ 
      origin: '*',
      credentials: true,
    });

    // Configuração explícita do WebSocket
    const io = require('socket.io')(httpAdapter.getInstance(), {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/socket.io'
});

    await app.listen(process.env.PORT || 8080, '0.0.0.0');
    console.log(`App started on port ${process.env.PORT || 8080}`);
  } catch (error) {
    console.error('Error starting app:', error);
    process.exit(1);
  }
}
bootstrap();