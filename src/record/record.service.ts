import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './record.entity';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {}

  findAll(userID: string) {
    return this.recordRepository.findBy({ userID });
  }

  insert(record: Record) {
    return this.recordRepository.insert(record);
  }

  updateContent(recordID: string, content: string) {
    return this.recordRepository.update({ id: recordID }, { content });
  }
}
