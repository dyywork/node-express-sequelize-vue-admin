'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParentMenu extends Model {
    /**
     * 定义关联的辅助方法.
     * 此方法不是Sequelize生命周期的一部分.
     * models/index文件将自动调用此方法.
     */
    static associate(models) {
      const {SubMenu} = models;
      ParentMenu.hasMany(SubMenu, { as: 'children', foreignKey: 'ParentMenuId' });
      // sequelize.sync({alter: true})
    }
  };
  ParentMenu.init({
    name: DataTypes.STRING,
    code: {type:DataTypes.STRING, allowNull: false},
    url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ParentMenu',
  });
  // (async () => {
  //   await ParentMenu.sync({ alter: true })
  // })()
  return ParentMenu;
};
