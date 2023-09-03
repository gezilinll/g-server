'use strict';

const BaseController = require('./base');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class UserController extends BaseController {
  async authorizeGithub() {
    const { ctx, app } = this;
    const requestToken = ctx.request.query.code;
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token?' +
        `client_id=${app.config.githubID}&` +
        `client_secret=${app.config.githubSecret}&` +
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
    const { id, name } = result.data;
    let user = await ctx.service.user.getUser({ githubID: id });
    if (!user) {
      const userID = uuidv4();
      const result = await ctx.service.user.add(
        {
          id: userID,
          userName: name,
          githubID: id,
        }
      );
      if (!result) {
        this.error('Register Failed!');
      }
      user = { id: userID, name };
    }
    ctx.response.redirect(`${app.config.webAddress}/?id=${user.id}`);
  }

  async getUserInfo() {
    const { ctx } = this;
    const user = await ctx.service.user.getUser({ id: ctx.request.query.id });
    if (user) {
      ctx.body = { id: user.id, userName: user.userName };
      ctx.status = 200;
    }
  }
}

module.exports = UserController;
