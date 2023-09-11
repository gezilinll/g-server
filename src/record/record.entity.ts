import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Record {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  userID: string;

  @Column('text')
  content: string;
}
