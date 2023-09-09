import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from './jwt.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Get('authorizeGithub')
  async authorizeGithub(
    @Query('code') requestToken: string,
    @Res() res: Response,
  ) {
    const tokenResponse = await axios({
      method: 'post',
      url:
        'https://github.com/login/oauth/access_token?' +
        `client_id=${process.env.githubID}&` +
        `client_secret=${process.env.githubSecret}&` +
        `code=${requestToken}`,
      headers: {
        accept: 'application/json',
      },
    });
    const accessToken = tokenResponse.data.access_token;
    const result = await axios({
      method: 'get',
      url: 'https://api.github.com/user',
      headers: {
        accept: 'application/json',
        Authorization: `token ${accessToken}`,
      },
    });
    const { id: githubID, name } = result.data;
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
    res.redirect(`${process.env.webAddress}/?token=${token}&userID=${user.id}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('findOne')
  async findOne(@Query('id') id: string, @Res() res: Response) {
    const user = await this.userService.findOneByID(id);
    if (user) {
      res.statusCode = 200;
      res.send({ id: user.id, userName: user.name });
    }
  }
}
