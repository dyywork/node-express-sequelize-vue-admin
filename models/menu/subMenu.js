'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubMenu extends Model {
    /**
     * 定义关联的辅助方法.
     * 此方法不是Sequelize生命周期的一部分.
     * models/index文件将自动调用此方法.
     */
    static associate(models) {
      const {ParentMenu} = models;
      SubMenu.belongsTo(ParentMenu);
      // sequelize.sync({alter: true})
    }
  };
  SubMenu.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    url: DataTypes.STRING,
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
