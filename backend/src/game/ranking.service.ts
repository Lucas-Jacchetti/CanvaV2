import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RankingService {
    private prisma = new PrismaClient();

    async save(playerId: string, time: number) {
        await this.prisma.rankingEntry.create({
        data: { playerId, time },
        });
    }

    async getTop(limit = 10) {
        return await this.prisma.rankingEntry.findMany({
        orderBy: { time: 'asc' },
        take: limit,
        });
    }

    async getById(playerId: string){
        await this.prisma.rankingEntry.findMany({
            where: { playerId },
            orderBy: { time: 'asc' }, //menor primeiro
        })
    }

    async getAll() {
        return await this.prisma.rankingEntry.findMany({
        orderBy: { time: 'asc' },
        });
    }

    async clear() {
        await this.prisma.rankingEntry.deleteMany();
    }
}
