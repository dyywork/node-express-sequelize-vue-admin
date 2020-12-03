'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * 定义关联的辅助方法。
     * 此方法不是Sequelize生命周期的一部分。
     * 模型/索引文件将自动调用此方法。
     */
    static associate(models) {
      // 在这里定义关联
      const {Duty, Roles, User} = models;
      Duty.belongsTo(User);
      Roles.belongsToMany(Duty, {through: 'rolesDuty'})
      // sequelize.sync({alter: true})
    }
  };
  Roles.init({
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    email: DataTypes.STRING,
    url: DataTypes.STRING,
    address: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.STRING,
    currentAuthority: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Roles',
  });
  // (async () => {
  //   await Roles.sync({ alter: true })
  // })()
  return Roles;
};
