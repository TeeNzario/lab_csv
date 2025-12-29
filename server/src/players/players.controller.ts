// players.controller.ts
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlayersService } from './players.service';


@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post('import-csv')
  @UseInterceptors(FileInterceptor('file'))
  importCsv(@UploadedFile() file: Express.Multer.File) {
    return this.playersService.importCsv(file);
  }

  @Get('test')
  test() {
    return this.playersService.test();
  }
}
