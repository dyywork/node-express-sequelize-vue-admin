const express = require('express');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();


const Sequelize = require('sequelize');

const {Op} = Sequelize;

const {User} = require('../../models');


const upload = multer({ dest: 'uploads' });

// 头像上传
router.post('/img', upload.single('file'), async (req, res, next) => {
  try {
    fs.renameSync(req.file.path, `uploads/${req.body.id}${req.file.originalname}`);
    await User.update({url: `http://${req.headers.host}/uploads/${req.body.id}${req.file.originalname}`}, {where: {id:req.body.id}}).then(files => {
      res.json({
        msg: '成功',
        data: files,
      })
    })
  }
  catch (err) {
    next();
  }
});


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

// 登录
router.post('/login', async (req, res, next) => {
  try{
    await User.findOne({where: {userName: req.body.userName}}).then(user => {
      if (user.password === req.body.password) {
        res.json({
          message: '登录成功',
          data: user,
        })
      } else {
        res.json({
          message: '用户名或密码错误',
        })
      }
    })
  }
  catch (err) {
    next();
  }
});


module.exports = router;
