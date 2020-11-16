'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
  }, {
    sequelize,
    modelName: 'User',
  });
  (async () => {
    await User.sync({ alter: true })
  })()
  return User;
};
