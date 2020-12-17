
const { sequelize, SubMenu, ParentMenu } = require('../../models');

module.exports = {
  createSubMenu: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      await SubMenu.findOrCreate({
        where: {
          code: req.body.code,
        },
        defaults: req.body,
        transaction: t,
      }).then(([data, created]) => {
        if (!created) {
          res.json({
            data,
            msg: '菜单编码不能重复'
          })
        } else {
          data.setParentMenus(req.body.parentMenuId)
          res.json({
            data,
            msg: '创建成功'
          })
        }
      })
      await t.commit();
    }
    catch (e) {
      await t.rollback();
      next(e)
    }
  },
  associateParent: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      await SubMenu.findByPk(req.query.id, {transaction: t}).then(data => {
        data.setParentMenus(req.query.parentId)
        res.json({
          data,
          msg: '配置成功'
        })
      });
      await t.commit();
    }
    catch (e) {
      await t.rollback();
      next(e)
    }
  },
  deleteSub: async (req, res, next) => {
    const t = await sequelize.transaction()
    const {id} = req.query;
    try {
      await SubMenu.destroy({where: {id}, transaction: t}).then(data => {
        res.json({data, msg: '删除成功'})
      })
      await t.commit();
    }
    catch (e) {
      await t.rollback();
      next(e);
    }
  }
};
