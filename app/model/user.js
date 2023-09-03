'use strict';

module.exports = app => {
  const { STRING } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: STRING, primaryKey: true },
    userName: STRING,
    githubID: STRING,
  });

  return User;
};
