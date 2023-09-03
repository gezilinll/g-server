'use strict';

const BaseService = require('./base');

class UserService extends BaseService {
  async getUser(where) {
    return this.run(async (ctx, _app) => {
      return await ctx.model.User.findOne({
        where,
      });
    });
  }

  async add(params) {
    return this.run(async ctx => await ctx.model.User.create(params));
  }

  async edit(params) {
    return this.run(async ctx => {
      return await ctx.model.User.update(params, {
        where: {
          username: ctx.username,
        },
      });
    });
  }
}

module.exports = UserService;
