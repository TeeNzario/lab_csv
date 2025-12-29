import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PlayersService } from './players/players.service';
import { PlayersController } from './players/players.controller';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  })],
  controllers: [AppController, PlayersController],
  providers: [AppService, PlayersService, PrismaService],
})
export class AppModule {}
