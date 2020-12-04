
const { sequelize, SubMenu } = require('../../models');

module.exports = {
  createSubMenu: async (req, res, next) => {
    try {
      await SubMenu.findOrCreate({
        where: {
          code: req.body.code,
        },
        defaults: req.body,
      }).then(([data, created]) => {
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
      next(e)
    }
  }
};
