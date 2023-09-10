import { Module } from '@nestjs/common';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.jwtSecret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [JwtStrategy, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
