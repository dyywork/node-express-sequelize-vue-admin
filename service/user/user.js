const fs = require('fs');
const xlsx = require('node-xlsx');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const {Op} = Sequelize;
const {sequelize, User, Roles, Duty, MenuModel} = require('../../models');
const {success, error} = require('../../utils/notice');

module.exports = {
  configRoles: async (req, res, next) => {
    const {id} = req.userInfo;
    const t = await sequelize.transaction();
    try {
      await User.findByPk(id).then(data => {
        if(data) {
          data.setChildren(req.body.roleIds);
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
      const {current=1, pageSize=10, userName} = req.query;
      await User.findAndCountAll({
        where: {
          [Op.and]: [
            {
              userName: {
                [Op.like]:`%${userName|| ''}%`,
              }
            }
          ]
        },
        limit: Number(pageSize),
        offset: Number(current-1)* Number(pageSize)}).then(list => {
        res.json({
          message: '查询成功',
          code: 200,
          data: list.rows,
          total: list.count,
          page: Number(current),
        })
      })
    }
    catch (err) {
      next();
    }
  },
  uploadHeaderImg: async (req, res, next) => {
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
  },
  exportUserList: async (req, res, next) => {
    try {
      const {userName, name} = req.query;
      await User.findAll({
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
    }
    catch (e) {
      next()
    }
  },
  createUser: async (req, res, next) => {
    let bodyObj = {};
    if (req.userInfo !== null && req.userInfo !== undefined && req.body.id === undefined) {
      const {name} = req.userInfo;
      bodyObj = {...req.body, createName: name, password: 123456};
    } else {
      bodyObj = {...req.body};
    }
    try {
      if (req.body.id === undefined) {
        await User.findOrCreate({where: {userName: req.body.userName}, defaults: bodyObj}).then(([user, created]) => {
          if (created) {
            res.json(success(user, '创建成功'));
          }
          res.json(error(user, '用户名已存在'));
        });
      } else {
        await User.update(req.body,{where: {id: req.body.id}}).then(data => {
          res.json(success(data, '编辑成功！'))
        })
      }
    }
    catch (err) {
      next();
    }
  },
  deleteUser: async (req, res, next) => {
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
  },
  updateUser: async (req, res, next) => {
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
    }
    catch (err) {
      next();
    }
  },
  currentUser: async (req, res, next) => {
    try{
      const {id} = req.userInfo;
      const user = await User.findOne({
        where: {id: id},
        attributes: { exclude: ['password', 'timeout', 'createName', 'children'] },
        include: [
          {
            model: Roles,
            as: 'children',
            through: {
              attributes: [],
            },
            include:  [
              {
                model: Duty,
                as: 'children',
                attributes: ['id'],
                through: {
                  attributes: [],
                },
                include: [
                  {
                    model: MenuModel,
                    as: 'children',
                    attributes: ['id', 'code'],
                    through: {
                      attributes: [],
                    },
                  }
                ]
              }
            ]
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
        roleData.filter(item => item.children.length>0).forEach(duty => {
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
        menuData.filter(item => item.children.length>0).forEach(menu => {
          menuList = [...menuList, ...menu.children]
        })
        user.currentAuthority = [...new Set(menuList.map(item => item.code))];
        const userData = JSON.parse(JSON.stringify(user))
        delete userData.children;
        res.json(success(user, '请求成功'))

      /* await User.findOne({where: {userName: req.body.userName}}).then(user => {
         if (user.password === req.body.password) {
           const token = jwt.sign({name: user.userName, id: user.id}, 'dingyongya');
           User.update({token, timeout: (new Date().getTime())+ 60*60*1000},{where:{id: user.id}}).then(() => {
             user.token = token;
             res.json({
               message: '登录成功',
               user
             })
           })
         } else {
           res.json({
             message: '用户名或密码错误',
           })
         }
       })*/
    }
    catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    try{
      const user = await User.findOne({
        where: {userName: req.body.userName},
        include: [
          {
            model: Roles,
            as: 'children',
            through: {
              attributes: [],
            },
            /*include: [
              {
                model: Duty,
                as: 'children',
                through: {
                  attributes: [],
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
              }
            ]*/
          }
        ]
      });
      if ( user && user.password === req.body.password) {
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
        roleData.filter(item => item.children.length>0).forEach(duty => {
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
        menuData.filter(item => item.children.length>0).forEach(menu => {
          menuList = [...menuList, ...menu.children]
        })
        const token = jwt.sign({name: user.userName, id: user.id}, 'dingyongya');
        await User.update({token, timeout: (new Date().getTime())+ 60*60*1000},{where:{id: user.id}});
        const objectUser = await User.findOne({
          attributes: ['token'],
          where: {
            id: user.id
          }
        })
        user.token = token;
        user.currentAuthority = [...new Set(menuList.map(item => item.code))];
        const userData = JSON.parse(JSON.stringify(user))
        delete userData.children;
        res.json(success(objectUser, '登录成功'))
      } else {
        res.json(error(null, '用户名或密码错误'))
      }
    }
    catch (err) {
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

