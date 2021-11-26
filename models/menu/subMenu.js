'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  class SubMenu extends Model {
    /**
     * 定义关联的辅助方法.
     * 此方法不是Sequelize生命周期的一部分.
     * models/index文件将自动调用此方法.
     */
    static associate(models) {
      const {ParentMenu} = models;
      // SubMenu.belongsTo(ParentMenu);
      SubMenu.belongsToMany(ParentMenu, { through: 'ParentSubMenu' });
      //  sequelize.sync({alter: true})
    }
  };
  SubMenu.init({
    title: DataTypes.STRING, // 菜单标题
    name: DataTypes.STRING, // 组件名称
    component: DataTypes.STRING, // 组件路径
    code: DataTypes.STRING,
    url: DataTypes.STRING, // 路由地址
    sort: {
      type: DataTypes.INTEGER,
      comment: '排序字段'
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '是否隐藏'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue:new Date(),
      get(){
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue:new Date(),
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    sequelize,
    timestamps: true,
    modelName: 'SubMenu',
  });
  // (async () => {
  //   await SubMenu.sync({ alter: true })
  // })()
  return SubMenu;
};
