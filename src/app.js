const express = require('express');
// 用于req.body获取值的
const bodyParser = require('body-parser');
const app = express();

const Router = require('../router/api');

app.use(bodyParser.json());

// 创建 application/x-www-form-urlencoded 编码解析 如果你传输的内容不是string类型时 extended: true;
app.use(bodyParser.urlencoded({ extended: false }));

Router(app);

app.listen(3000, () => {
  console.log('服务启动成功')
});

module.exports = app;
