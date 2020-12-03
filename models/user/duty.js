'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Duty extends Model {
    /**
     * 定义关联的辅助方法。
     * 此方法不是Sequelize生命周期的一部分。
     * 模型/索引文件将自动调用此方法。
     */
    static associate(models) {
      const {Duty, Roles} = models;
      Duty.belongsToMany(Roles, {through: 'rolesDuty'})
      // sequelize.sync({alter: true})
    }
  };
  Duty.init({
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
    modelName: 'Duty',
  });
  // (async () => {
  //   await Duty.sync({ alter: true })
  // })()
  return Duty;
};
