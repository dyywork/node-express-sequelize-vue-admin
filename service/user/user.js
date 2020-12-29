const fs = require('fs');
const xlsx = require('node-xlsx');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const {Op} = Sequelize;
const {sequelize, User, Roles, Duty, MenuModel} = require('../../models');
const {success, error} = require('../../utils/notice');

module.exports = {
  configRoles: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      await User.findByPk(req.query.id).then(data => {
        if (data) {
          data.setChildren(req.query.roleIds.split(','));
          res.json(success(data, '配置成功'))
        } else {
          res.json(error(data, '没有用户'))
        }
      })
      await t.commit();
    } catch (e) {
      await t.rollback();
      next(e)
    }
  },
  userList: async (req, res, next) => {
    try {
      const {page, size, userName, name} = req.query;
      await User.findAndCountAll({
        where: {
          [Op.or]: [
            {
              userName: {
                [Op.like]: `%${userName}%`,
              }
            },
            {
              name: {
                [Op.like]: `%${name}%`,
              }
            }
          ]
        },
        limit: Number(size),
        offset: Number(page - 1) * Number(size)
      }).then(list => {
        res.json({
          message: '查询成功',
          list: {
            ...list,
            page: Number(page),
            size: Number(size),
          }
        })
      })
    } catch (err) {
      next();
    }
  },
  uploadHeaderImg: async (req, res, next) => {
    try {
      fs.renameSync(req.file.path, `uploads/${req.body.id}${req.file.originalname}`);
      await User.update({url: `http://${req.headers.host}/uploads/${req.body.id}${req.file.originalname}`}, {where: {id: req.body.id}}).then(files => {
        res.json({
          msg: '成功',
          data: files,
        })
      })
    } catch (err) {
      next();
    }
  },
  exportUserList: async (req, res, next) => {
    try {
      const {userName, name} = req.query;
      await User.findAll({
        where: {
          [Op.or]: [
            {
              userName: {
                [Op.like]: `%${userName}%`,
              }
            },
            {
              name: {
                [Op.like]: `%${name}%`,
              }
            }
          ]
        },
      }).then(list => {
        const dataList = [];
        const titleList = ['用户名', '密码', '邮箱'];
        dataList.push(titleList);
        list.forEach(item => {
          const arr = [];
          arr.push(item.userName);
          arr.push(item.password);
          arr.push(item.email);
          dataList.push(arr);
        })
        const buffer = xlsx.build([{name: 'sheet1', data: dataList}]);
        const name = `user${new Date().toLocaleDateString()}`
        fs.writeFileSync(`./uploads/${name}.xlsx`, buffer, {'flag': 'w'});
        res.download(`./uploads/${name}.xlsx`);
      })
    } catch (e) {
      next()
    }
  },
  createUser: async (req, res, next) => {
    try {
      await User.findOrCreate({
        where: {userName: req.body.userName},
        defaults: {...req.body, status: 'ok'}
      }).then(([user, created]) => {
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
    } catch (err) {
      next();
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const {id} = req.params;
      await User.destroy({where: {id}, force: true}).then(user => {
        res.json({
          message: '删除成功',
        })
      })
    } catch (err) {
      next();
    }
  },
  updateUser: async (req, res, next) => {
    try {
      await User.update(req.body, {where: {id: req.body.id}}).then(user => {
        res.json({
          message: '更新成功',
          user,
        })
      })
    } catch (err) {
      next();
    }
  },
  getUserDetails: async (req, res, next) => {
    try {
      const {id} = req.params;
      await User.findByPk(id).then(user => {
        res.json({
          message: '查询成功',
          user,
        })
      })
    } catch (err) {
      next();
    }
  },
  currentUser: async (req, res, next) => {
    try {
      const {id} = req.userInfo;
      const user = await User.findOne({
        where: {id: id},
        include: [
          {
            model: Roles,
            as: 'children',
            through: {
              attributes: [],
            },
            // include: [
            //   {
            //     model: Duty,
            //     as: 'children',
            //     through: {
            //       attributes: [],
            //     },
            //     include: [
            //       {
            //         model: MenuModel,
            //         as: 'children',
            //         through: {
            //           attributes: [],
            //         },
            //       }
            //     ]
            //   }
            // ]
          }
        ]
      });
      const roleIds = user.children.map(item => item.id);
      const roleData = await Roles.findAll({
        where: {
          id: {
            [Op.in]: roleIds,
          }
        },
        include: [
          {
            model: Duty,
            as: 'children',
            through: {
              attributes: [],
            },
          }
        ]
      })
      let dutyList = [];
      roleData.filter(item => item.children.length > 0).forEach(duty => {
        dutyList = [...dutyList, ...duty.children]
      })
      const dutyIds = dutyList.map(item => item.id);
      const menuData = await Duty.findAll({
        where: {
          id: {
            [Op.in]: dutyIds,
          }
        },
        include: [
          {
            model: MenuModel,
            as: 'children',
            through: {
              attributes: [],
            },
          }
        ]
      });
      let menuList = [];
      menuData.filter(item => item.children.length > 0).forEach(menu => {
        menuList = [...menuList, ...menu.children]
      })
      user.currentAuthority = [...new Set(menuList.map(item => item.code))];
      const userData = JSON.parse(JSON.stringify(user))
      delete userData.children;
      delete userData.password;
      delete userData.timeout;
      res.json(success(userData, '登录成功'))
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {userName: req.body.userName},
        include: [
          {
            model: Roles,
            as: 'children',
            through: {
              attributes: [],
            },
            // include: [
            //   {
            //     model: Duty,
            //     as: 'children',
            //     through: {
            //       attributes: [],
            //     },
            //     include: [
            //       {
            //         model: MenuModel,
            //         as: 'children',
            //         through: {
            //           attributes: [],
            //         },
            //       }
            //     ]
            //   }
            // ]
          }
        ]
      });
      if (user.password === req.body.password) {
        const roleIds = user.children.map(item => item.id);
        const roleData = await Roles.findAll({
          where: {
            id: {
              [Op.in]: roleIds,
            }
          },
          include: [
            {
              model: Duty,
              as: 'children',
              through: {
                attributes: [],
              },
            }
          ]
        })
        let dutyList = [];
        roleData.filter(item => item.children.length > 0).forEach(duty => {
          dutyList = [...dutyList, ...duty.children]
        })
        const dutyIds = dutyList.map(item => item.id);
        const menuData = await Duty.findAll({
          where: {
            id: {
              [Op.in]: dutyIds,
            }
          },
          include: [
            {
              model: MenuModel,
              as: 'children',
              through: {
                attributes: [],
              },
            }
          ]
        });
        let menuList = [];
        menuData.filter(item => item.children.length > 0).forEach(menu => {
          menuList = [...menuList, ...menu.children]
        })
        const token = jwt.sign({name: user.userName, id: user.id}, 'dingyongya');
        await User.update({token, timeout: (new Date().getTime()) + 60 * 60 * 1000}, {where: {id: user.id}});
        user.token = token;
        user.currentAuthority = [...new Set(menuList.map(item => item.code))];
        const userData = JSON.parse(JSON.stringify(user))
        delete userData.children;
        delete userData.password;
        delete userData.timeout;
        res.json(success(userData, '登录成功'))
      } else {
        res.json(error(data, '用户名或密码错误'))
      }
    } catch (err) {
      next(err);
    }
  }
};


/**
 * @api {POST} /user/create getUserInfof
 * @apiGroup User
 *
 * @apiParam {String} name 登aa录名1
 * @apiParamExample {json} Request-Example
 * {
 *  "userName": "Eve"
 * }
 *
 * @apiSuccessExample  {json} Response-Example
 * {
 *   "userName": "adfaafadadfadf",
 *   "createTime": "1568901681"
 *   "updateTime": "1568901681"
 * }
 */

