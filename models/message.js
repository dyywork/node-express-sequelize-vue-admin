'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // console.log(models)
      // const {Message, User} = models;
      // console.log(Message)
      // console.log(User)
      // Message.belongsTo(User);
      // (async () => {
      //   await User.hasOne(Message);
      //   await Message.belongsTo(User);
      // })()
    }
  };
  Message.init({
    name: DataTypes.STRING,
    message: DataTypes.STRING,
    url: DataTypes.STRING,
    magkey: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.STRING,
    position: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Message',
  });
  // (async () => {
  //   await Message.sync({ force: true })
  // })()
  return Message;
};
