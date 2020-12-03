const express = require('express');
const router = express.Router();
const verifyToken = require('../../utils/verificationToken');
const { sequelize, ParentMenu, SubMenu } = require('../../models');
// 创建
router.post('/createParentMenu', async (req, res, next) => {
  try {
    await ParentMenu.findOrCreate({
      where: {
        code: req.body.code,
      },
      defaults: {
        ...req.body
      }
    }).then(([data,created], ) => {
      if (!created) {
        res.json({
          data,
          msg: '菜单编码不能重复'
        })
      } else {
        res.json({
          data,
          msg: '创建成功'
        })
      }
    })
  }
  catch (e) {
    next();
  }
})

router.get('/list', verifyToken, async (req, res, next) => {
  try {
    await ParentMenu.findAll({include: {model:SubMenu, as: 'children'} }).then(list => {
      res.json({
        list,
        msg: '查询成功'
      })
    })
  }
  catch (e) {
    res.json(e)
    next()
  }
})

router.delete('/delete/:id', async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    await SubMenu.destroy({where: {ParentMenuId: req.params.id}, transaction: t});
    await ParentMenu.destroy({where: {id: req.params.id}, transaction: t}).then(data => {
      res.json({data, msg: '删除成功'});
    });
    await t.commit();
  }
  catch (e) {
    await t.rollback();
    next(e)
  }
})

module.exports = router;
