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
import { BoardService } from './board.service';
import { format } from 'date-fns';

@UseGuards(JwtAuthGuard)
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('find')
  async find(@Query('id') id: string, @Res() res: Response) {
    const result = await this.boardService.find(id);
    res.status(HttpStatus.OK).send(result[0]);
  }

  @Get('findAll')
  async findAll(@Query('userID') userID: string, @Res() res: Response) {
    const records = await this.boardService.findAll(userID);
    const result = records.map((item) => {
      return {
        id: item.id,
        title: item.title,
        permission: item.permission,
        updatedAt: format(item.updatedAt, 'MM-dd-yy HH:mm:ss'),
        createdAt: format(item.createdAt, 'MM-dd-yy HH:mm:ss'),
      };
    });
    res.status(HttpStatus.OK).send(result);
  }

  @Get('create')
  async create(@Query('userID') userID: string, @Res() res: Response) {
    const id = uuidv4();
    const initBoard = {
      id,
      title: 'Untitled',
      elements: [],
    };
    const content = JSON.stringify(initBoard);

    const timestamp = new Date();
    const sendInfo = {
      id,
      title: initBoard.title,
      permission: 'public',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await this.boardService.insert({
      ...sendInfo,
      userID,
      content,
    });
    res.status(HttpStatus.OK).send(sendInfo);
  }

  @Get('updateContent')
  async updateContent(
    @Query('id') id: string,
    @Query('content') content: string,
    @Res() res: Response,
  ) {
    await this.boardService.updateContent(id, content);
    res.status(HttpStatus.OK).send();
  }
}
