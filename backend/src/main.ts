import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ 
      origin: [
      'http://localhost:5173', // frontend local (Vite)
      'https://canva-v2-iota.vercel.app' // substitua pelo domínio real do seu frontend
    ],
    credentials: true,
    });

    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
    console.log('App started on port', process.env.PORT ?? 3000);
  } catch (error) {
    console.error('Error starting app:', error);
    process.exit(1);
  }
}
bootstrap();
