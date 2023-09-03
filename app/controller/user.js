'use strict';

const BaseController = require('./base');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class UserController extends BaseController {
  async authorizeGithub() {
    const { ctx } = this;
    const requestToken = ctx.request.query.code;
    const clientID = '2fc9877432c55cb75217';
    const clientSecret = 'ec8dee6348e6059c084a71e4bbbb15abec5a9466';
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token?' +
        `client_id=${clientID}&` +
        `client_secret=${clientSecret}&` +
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
    ctx.response.redirect(`http://localhost:5173/?id=${user.id}`);
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
