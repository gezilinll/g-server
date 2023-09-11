import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RecordService } from './record.service';

@UseGuards(JwtAuthGuard)
@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get('findAll')
  async findAll(@Query('userID') userID: string, @Res() res: Response) {
    const records = await this.recordService.findAll(userID);
    res.status(HttpStatus.OK).send(records);
  }

  @Get('create')
  async create(@Query('userID') userID: string, @Res() res: Response) {
    const id = uuidv4();
    const initRecord = {
      id,
      title: 'Untitled',
      elements: [],
    };
    const content = JSON.stringify(initRecord);

    await this.recordService.insert({
      id,
      userID,
      title: initRecord.title,
      content,
    });
    res.status(HttpStatus.OK).send({ id, title: 'Untitled', content });
  }

  @Get('updateContent')
  async updateContent(
    @Query('recordID') recordID: string,
    @Query('content') content: string,
    @Res() res: Response,
  ) {
    await this.recordService.updateContent(recordID, content);
    res.status(HttpStatus.OK).send();
  }
}
