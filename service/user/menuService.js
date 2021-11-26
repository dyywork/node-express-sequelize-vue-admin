const { sequelize, MenuModel } = require('../../models');
const { success, error } = require('../../utils/notice');
const { compare, generateTree, getIds } = require('@/utils/index')

module.exports = {
  list: async (req, res, next) => {
    try {
      const data = await MenuModel.findAll({
        order: [
          ['order'],
        ]
      });
      data.sort(compare("order"))
      const list = await generateTree(data, {pId: 'parentId', id: 'id'})
      res.json(success(list, '查询成功'));
    } catch (e) {
      next(e)
    }
  },
  create: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      if(req.body.id) {
        await MenuModel.update(req.body, {where: {id: req.body.id}}).then(data => {
          res.json(success(data, '修改成功'))
        })
      } else {
        await MenuModel.findOrCreate(
          {
            where: {
              code: req.body.code,
            },
            defaults: req.body,
            transaction: t,
          }
        ).then(([data, created]) => {
          if (!created) {
            res.json(error('', '编码不能重复'))
          } else {
            res.json(success(data, '创建成功'))
          }
        })
      }
      await t.commit();
    } catch (e) {
      await t.rollback();
      next(e)
    }
  },
  deleteService: async (req, res, next) => {
    const t = await sequelize.transaction();
    const {id} = req.query;
    try {
      const data = await MenuModel.findAll({
        order: [
          ['order'],
        ]
      });
      data.sort(compare("order"))
      const list = await generateTree(data, {pId: 'parentId', id: 'id'})
      const ids = await getIds(list, id.split(',').map(item => Number(item)))
      const result = await MenuModel.destroy({
        where: {
          id: ids
        }
      }, {transaction: t});
      if(result > 0) {
        res.json(success(result, '删除成功'))
      } else {
        res.json(error(result, '删除失败'))
      }
    }
    catch (e) {
      next(e)
    }
  }
}
