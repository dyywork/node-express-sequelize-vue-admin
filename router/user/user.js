const express = require('express');
const router = express.Router();

const models = require('../../models');

router.post('/create', async (req, res) => {
  let user = await models.User.create(req.body);
  res.json({
    message: '创建成功',
    user
  })
});

module.exports = router;
