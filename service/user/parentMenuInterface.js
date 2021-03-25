const {sequelize, ParentMenu, SubMenu} = require('../../models');
const Sequelize = require('sequelize');
const {success, error} = require('../../utils/notice');
const {Op} = Sequelize;
module.exports = {
  createParentMenu: async (req, res, next) => {
    try {
      await ParentMenu.findOrCreate({
        where: {
          code: req.body.code,
        },
        defaults: {
          ...req.body
        }
      }).then(([data, created],) => {
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
    } catch (e) {
      next();
    }
  },
  getList: async (req, res, next) => {
    try {
      await ParentMenu.findAll({
        include: [
          {
            model: SubMenu, as: 'children', through: {
              attributes: []
            }
          },
        ]
      }).then(list => {
        res.json(success(list, '查询成功'))
      })
    } catch (e) {
      res.json(e)
      next()
    }
  },
  deleteMenu: async (req, res, next) => {
    const t = await sequelize.transaction()
    try {
      await ParentMenu.destroy({where: {id: req.params.id}, transaction: t}).then(data => {
        res.json({data, msg: '删除成功'});
      });
      await t.commit();
    } catch (e) {
      await t.rollback();
      next(e)
    }
  },
  getCodeList: async (req, res, next) => {
    try {
      await ParentMenu.findAll({
        where: {id: {[Op.in]: [...req.query.id]}},
        include: [
          {
            model: SubMenu,
            as: 'children',
            through: {
              attributes: []
            },
            attributes: ['code']
          },
        ],
        attributes:['code']
      }).then(data => {
        res.json({
          data,
          msg: '成功'
        })
      })
    } catch (e) {
      next(e)
    }
  }
};
