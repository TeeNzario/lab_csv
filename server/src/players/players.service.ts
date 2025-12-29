// players.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { PrismaService } from '../prisma/prisma.service';

@Injectable() 
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async importCsv(file: Express.Multer.File) {
    //if don't have file
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }

    // type of players
    const players: {
      playerName: string;
      riotId: string;
      region: string;
      rank: string;
      mainAgent: string;
      headshotRate: number;
      kdRatio: number;
      matchesPlayed: number;
    }[] = [];

    return new Promise((resolve, reject) => {
      Readable.from(file.buffer)
        .pipe(csv())
        .on('data', (row) => {
          players.push({
            playerName: row.player_name,
            riotId: row.riot_id,
            region: row.region,
            rank: row.rank,
            mainAgent: row.main_agent,
            headshotRate: Number(row.headshot_rate),
            kdRatio: Number(row.kd_ratio),
            matchesPlayed: Number(row.matches_played),
          });
        })
        .on('end', async () => {
          try {
            await this.prisma.valorantPlayer.createMany({
              data: players,
              skipDuplicates: true,
            });

            resolve({
              message: 'Import success',
              count: players.length,
            });
          } catch (err) {
            reject(err);
          }
        })
        .on('error', reject);
    });
  }

  async test() {
    await this.prisma.$queryRaw`SHOW search_path`;

  }

}
