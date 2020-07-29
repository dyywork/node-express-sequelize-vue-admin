const express = require('express');
const router = express.Router();

const models = require('../../models');

router.get('/create', async (req, res) => {
  let {name, name1, email} = req.query;
  console.log(name)
  let user = await models.User.create({
    firstName:name,
    lastName: name1,
    email: email,
  })
  res.json({
    message: '创建成功',
    user
  })
})

module.exports = router;