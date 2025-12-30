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

    const rows: any[] = [];

    await new Promise((resolve, reject) => {
      Readable.from(file.buffer)
        .pipe(csv())
        .on('data', (data) => rows.push(data))
        .on('end', resolve)
        .on('error', reject);
    })

    for (const row of rows) {
      let error: string | null = null

      if (!row.riot_id) {
        error = 'riot_id is required'
      } else {
        const exists = await this.prisma.valorantPlayer.findUnique({
          where: { riotId: row.riot_id },
        })
        if (exists) error = 'riot_id already exists'
      }

      console.log(row)
      await this.prisma.valorantPlayerImport.create({
        data: {
          playerName: row.player_name || null,
          riotId: row.riot_id|| null,
          region: row.region || null,
          rank: row.rank || null,
          mainAgent: row.main_agent || null,
          headshotRate: row.headshot_rate
            ? Number(row.headshot_rate)
            : null,
          kdRatio: row.kd_ratio ? Number(row.kd_ratio) : null,
          matchesPlayed: row.matches_played
            ? Number(row.matches_played)
            : null,

          isValid: !error,
          errorMessage: error,
        },
      })
    }

    return { message: 'CSV imported to preview table' }
}

  //for check import preview
  getImportPreview() {
    return this.prisma.valorantPlayerImport.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  async commitImport(ids: number[]) {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('ids required')
    }

    const rows = await this.prisma.valorantPlayerImport.findMany({
      where: {
        id: { in: ids },
        isValid: true,
      },
    })

    await this.prisma.$transaction(async (tx) => {
      for (const row of rows) {
        await tx.valorantPlayer.create({
          data: {
            playerName: row.playerName!,
            riotId: row.riotId!,
            region: row.region!,
            rank: row.rank!,
            mainAgent: row.mainAgent!,
            headshotRate: row.headshotRate!,
            kdRatio: row.kdRatio!,
            matchesPlayed: row.matchesPlayed!,
          },
        })
      }

      await tx.valorantPlayerImport.deleteMany({
        where: { id: { in: ids } },
      })
    })

    return {
      message: `Imported ${rows.length} players`,
    }
  }

  async test() {
    await this.prisma.$queryRaw`SHOW search_path`;

  }

}
