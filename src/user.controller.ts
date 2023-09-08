import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    const { githubID, name } = result.data;
    let user = await this.userService.findByGithubID(githubID);
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
      user = { id: userID, name, githubID };
    }

    res.redirect(`${process.env.webAddress}/?id=${user.id}`);
  }

  @Get('requestUserInfo')
  async requestUserInfo(@Query('id') id: string, @Res() res: Response) {
    const user = await this.userService.findByID(id);
    if (user) {
      res.statusCode = 200;
      res.write({ id: user.id, userName: user.name });
    }
  }
}
