import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { JwtService } from '@nestjs/jwt';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Get('register')
  async register(@Req() request: Request, @Res() res: Response) {
    if (request.query.platform === 'github') {
      const githubID = request.query.id as string;
      const name = request.query.name as string;
      let user = await this.userService.findOneByGithubID(githubID);
      if (!user) {
        const userID = uuidv4();
        const result = await this.userService.insert({
          id: userID,
          name: name,
          githubID,
        });
        if (!result) {
          //TODO
        }
        console.log('authorizeGithub A', userID);
        user = { id: userID, name, githubID };
      }
      const token = await this.jwtService.signAsync(JSON.stringify(user), {
        secret: process.env.jwtSecret,
      });
      res.redirect(
        `${process.env.webAddress}/?token=${token}&userID=${user.id}`,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('findOne')
  async findOne(@Query('id') id: string, @Res() res: Response) {
    const user = await this.userService.findOneByID(id);
    if (user) {
      res.statusCode = 200;
      res.send({ id: user.id, name: user.name });
    }
  }
}
