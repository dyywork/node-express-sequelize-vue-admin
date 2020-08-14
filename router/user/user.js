const express = require('express');
const router = express.Router();

const {User} = require('../../models');

// 创建用户
router.post('/create', async (req, res, next) => {
  try {
     await User.findOrCreate({where: {userName: req.body.userName}, defaults: req.body}).then(([user, created]) => {
       if (created) {
         res.json({
           message: '创建成功',
           user
         });
       }
       res.json({
         message: '用户名已经存在',
       });
     });
  }
  catch (err) {
    next();
  }
});

// 删除用户
router.delete('/:id', async (req, res, next) => {
  try{
    const {id} = req.params;
    await User.destroy({where: {id}, force: true}).then(user => {
      res.json({
        message: '删除成功',
      })
    })
  }
  catch (err) {
    next();
  }
});

// 查询用户
router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    await User.findByPk(id).then(user => {
      res.json({
        message: '查询成功',
        user,
      })
    })
  }
  catch (err) {
    next();
  }
});


module.exports = router;
