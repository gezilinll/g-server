import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RecordModule } from './board/board.module';
import { Board } from './board/board.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: process.env.dbPWD,
      database: 'g-database',
      entities: [User, Board],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    RecordModule,
  ],
})
export class AppModule {}
