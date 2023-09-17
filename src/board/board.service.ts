import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  find(id: string) {
    return this.boardRepository.find({
      where: { id },
    });
  }

  findAll(userID: string) {
    return this.boardRepository.find({
      where: { userID },
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  insert(board: Board) {
    return this.boardRepository.insert(board);
  }

  updateContent(id: string, content: string) {
    return this.boardRepository.update({ id }, { content });
  }
}
