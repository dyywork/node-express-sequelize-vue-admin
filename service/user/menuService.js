const { sequelize, MenuModel } = require('../../models');
const { success, error } = require('../../utils/notice');
import { compare, generateTree } from '@/utils/index'


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
  }
}
