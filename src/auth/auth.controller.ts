import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Get('github')
  async github(@Query('code') requestToken: string, @Res() res: Response) {
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
    res.redirect(`/user/register?platform=github&id=${githubID}&name=${name}`);
  }
}
