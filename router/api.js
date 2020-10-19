module.exports = (app) => {
  app.use('/api/user', require('./user/user'));
  app.use('/api/list', require('./user/listInterface'));
};

