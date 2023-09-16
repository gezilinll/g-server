import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Board {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  userID: string;

  @Column('text')
  content: string;

  @Column()
  permission: string;

  @Column('timestamp')
  createdAt: Date;

  @Column('timestamp')
  updatedAt: Date;
}
