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
    await this.boardService.insert({
      id,
      userID,
      title: initBoard.title,
      content,
      permission: 'public',
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    res.status(HttpStatus.OK).send({ id, title: initBoard.title, content });
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
