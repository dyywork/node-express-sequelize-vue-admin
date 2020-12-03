

module.exports = (app) => {
  app.use('/api/user', require('./user/user'));
  app.use('/api/list', require('./user/listInterface'));
  app.use('/api/menu', require('./user/parentMenuInterface'));
  app.use('/api/subMenu', require('./user/subMenuInterface'));
};

