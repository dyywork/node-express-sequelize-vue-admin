const express = require('express');
// 用于req.body获取值的
const bodyParser = require('body-parser');
const app = express();
const verifyToken = require('../utils/verificationToken')
const Router = require('../controller/api');

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

app.use(bodyParser.json());

// 创建 application/x-www-form-urlencoded 编码解析 如果你传输的内容不是string类型时 extended: true;
app.use(bodyParser.urlencoded({extended: false}));

app.use('/uploads', express.static('uploads'));
app.use('/doc', express.static('doc'));
const whitelist = ['/api/user/login', '/api/user/create'];
app.all('/api/*', async (req, res, next) => {
  if (!whitelist.includes(req.url) || /Template/.test(req.url)) {
    await verifyToken(req, res, next)
  } else {
    next();
  }
})
Router(app);

app.listen(3000, () => {
  console.log('服务启动成功')
});


module.exports = app;
