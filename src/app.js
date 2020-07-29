const express = require('express');
const app = express();

const Router = require('../seeders/api');

// const models = require('../models');

// app.get('/create', async (req, res) => {
//   let {name, name1, email} = req.query;
//   console.log(name)
//   let user = await models.User.create({
//     firstName:name,
//     lastName: name1,
//     email: email,
//   })
//   res.json({
//     message: '创建成功',
//     user
//   })
// })

Router(app);

app.listen(3000, () => {
  console.log('服务启动成功')
})
