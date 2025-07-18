import { Controller, Get, Delete, Query, Param } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('ranking')
export class RankingContoller{
    constructor (private readonly rankingService: RankingService) {}

    @Get('topten')
    async getRanking(@Query('limit') limit?: string){ //opção de passar um limite de jogadores do ranking
        const parsedLimit = parseInt(limit || '10', 10); //como limit vem como string, converte para int, para então ser passado na função getTop(limit), e se nada for dado, usa 10
        return await this.rankingService.getTop(parsedLimit);
    }

    @Get()
    async getAll(){
        return await this.rankingService.getAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string){
        return await this.rankingService.getById(id)
    }

    @Delete()
    async clearRanking() {
        await this.rankingService.clear();
        return { message: 'Ranking limpo com sucesso!' };
    }
}