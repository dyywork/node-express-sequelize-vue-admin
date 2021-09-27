const {sequelize, Duty, MenuModel} = require('../../models');
const {success, error} = require('../../utils/notice');
const Sequelize = require('sequelize');
const {Op} = Sequelize;

module.exports = {
  getList: async (req, res, next) => {
    try {
      const {current, pageSize, name} = req.query;
      await Duty.findAndCountAll({
        where: {
          [Op.and]: [
            {
              name: {
                [Op.like]:`%${name|| ''}%`,
              }
            }
          ]
        },
        limit: Number(pageSize),
        offset: Number(current-1)* Number(pageSize)}).then(list => {
        res.json({
          message: '查询成功',
          data: list.rows,
          total: list.count,
          current: Number(current),
          pageSize: Number(pageSize),
        })
      })
    }
    catch (err) {
      next();
    }
  },
  createDuty: async (req, res, next) => {
    const userInfo = req.userInfo;
    const t = await sequelize.transaction();
    try {
      await Duty.findOrCreate({
        where: {code: req.body.code},
        defaults: {
          ...req.body,
          creatorId: userInfo.id,
          creator: userInfo.name
        },
        transaction: t,
      }).then(([data, created]) => {
        if (!created) {
          res.json(error('', '职责已存在'));
        } else {
          data.setChildren(req.body.menuId.split(','))
          res.json(success(data, '创建成功'))
        }
      })
      await t.commit();
    } catch (e) {
      await t.rollback();
      next(e)
    }
  },
  detail: async (req, res, next) => {
    try {
      await Duty.findAll({
        where: {
          id: {
            [Op.in]: req.query.id.split(',')
          }
        },
        include: [
          {
            model: MenuModel,
            as: 'children',
            attributes: ['id'],
            through: {
              attributes: []
            },
          }]
      }).then(data => {
        const dutyList = JSON.parse(JSON.stringify(data));
        const ids = dutyList[0].children.map(item => item.id);
        res.json(success({...dutyList[0], ids}, '查询成功'))
        // data.getMenuModels({where: {id: 3}}).then(list => {
        //   console.log(JSON.stringify(list))
        //
        // })
      })
    } catch (e) {
      next(e)
    }
  },
  details: async (req, res, next) => {
    try {
      await Duty.findOne({
        where: {id: req.query.id},
      }).then(data => {
        res.json(success(data.hasMenuModels(3), '查询成功'))
        // data.getMenuModels({where: {id: 3}}).then(list => {
        //   console.log(JSON.stringify(list))
        //
        // })
      })
    } catch (e) {
      next(e)
    }
  }
};
