'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * 定义关联的辅助方法。
     * This method is not a part of Sequelize lifecycle.
     * 模型/索引文件将自动调用此方法。
     */
    static associate(models) {
      // 在这里定义关联
      // console.log(models)
      const { Roles } = models;
      User.belongsToMany(Roles, {through: "userRoles", as: 'children'});
      // sequelize.sync({alter: true})
    }
  };
  User.init({
    userName: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    email: DataTypes.STRING,
    url: DataTypes.STRING,
    token: DataTypes.STRING,
    address: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.STRING,
    currentAuthority: DataTypes.STRING,
    createName: DataTypes.STRING,
    timeout: DataTypes.DATE,
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
    timestamps: true,
    sequelize,
    modelName: 'User',
  });
  // (async () => {
  //   await User.sync({ alter: true })
  // })()
  return User;
};
