import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { Record } from './record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Record])],
  providers: [RecordService],
  controllers: [RecordController],
})
export class RecordModule {}
