import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameGateway } from './game/game.gateway';
import { GameService } from './game/game.service';
import { RankingService } from './game/ranking.service';

@Module({
  imports: [],
  controllers: [AppController, RankingContoller],
  providers: [AppService, GameGateway, GameService, RankingService],
})
export class AppModule {}
