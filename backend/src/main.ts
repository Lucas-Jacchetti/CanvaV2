import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ 
      origin: '*',
    credentials: true,
    });

  await app.listen(process.env.PORT || 8080, '0.0.0.0');    console.log('App started on port', process.env.PORT ?? 3000);
  } catch (error) {
    console.error('Error starting app:', error);
    process.exit(1);
  }
}
bootstrap();
