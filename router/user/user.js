const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const {Op} = Sequelize;

const {User} = require('../../models');

// 用户分页列表查询
router.get('/list', async (req, res, next) => {
  try {
    const {page, size, userName, name} = req.query;
    await User.findAndCountAll({
      where: {
        [Op.or]: [
          {
            userName: {
              [Op.like]:`%${userName}%`,
            }
          },
          {
            name: {
              [Op.like]:`%${name}%`,
            }
          }
        ]
      },
      limit: Number(size),
      offset: Number(page-1)* Number(size)}).then(list => {
      res.json({
        message: '查询成功',
        list: {
          ...list,
          page: Number(page),
          size: Number(size),
        }
      })
    })
  }
  catch (err) {
    next();
  }
});

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

// 更新用户
router.put('/update', async (req, res, next) => {
  try {
    await User.update(req.body, {where: {id:req.body.id}}).then(user => {
      res.json({
        message: '更新成功',
        user,
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
