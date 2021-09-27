'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  class MenuModel extends Model {
    /**
     * 定义关联的辅助方法.
     * 此方法不是Sequelize生命周期的一部分.
     * models/index文件将自动调用此方法.
     */
    static associate(models) {
      const { Duty } = models;
      MenuModel.belongsToMany(Duty, {through: 'DutyMenuModel'})
      // SubMenu.belongsTo(ParentMenu);
      // SubMenu.belongsToMany(ParentMenu, { through: 'ParentSubMenu' });
      // sequelize.sync({alter: true})

    }
  };
  MenuModel.init({
    name: {type:DataTypes.STRING, allowNull: false},
    code: {type:DataTypes.STRING, allowNull: false},
    url: DataTypes.STRING,
    icon: DataTypes.STRING,
    parentId: DataTypes.INTEGER,
    order: DataTypes.INTEGER,
    children: DataTypes.VIRTUAL, // 虚拟字段，数据库里没有
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
    modelName: 'MenuModel',
  });
  // (async () => {
  //   await SubMenu.sync({ alter: true })
  // })()
  return MenuModel;
};
