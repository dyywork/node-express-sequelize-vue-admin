const express = require('express');
// 用于req.body获取值的
 const bodyParser = require('body-parser');
const app = express();
const verifyToken = require('../utils/verificationToken')
const Router = require('../controller/api');
require('module-alias/register')

app.use(express.json({limit: '50m'}))

app.use(express.urlencoded({ extended: false, limit: '50m' }))

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static('uploads'));
app.use('/doc', express.static('doc'));
const whitelist = ['/api/user/login', '/api/user/create',];
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, token, authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.all('/api/*', async (req, res, next) => {
  if (!whitelist.includes(req.url) || /Template/.test(req.url)) {
    await verifyToken(req, res, next)
  } else {
    next();
  }
})
Router(app);

app.listen(3000, () => {
  console.log('服务启动成功;port:3000');
});


module.exports = app;
