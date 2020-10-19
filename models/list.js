'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class List extends Model {
    /**
     * 定义关联的辅助方法.
     * 此方法不是Sequelize生命周期的一部分.
     * models/index文件将自动调用此方法.
     */
    static associate(models) {
      // define association here
      console.log(models)
    }
  };
  List.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'List',
  });
  return List;
};
