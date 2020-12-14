'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
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
    position: DataTypes.STRING,
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
    modelName: 'Message',
  });
  // (async () => {
  //   await Message.sync({ force: true })
  // })()
  return Message;
};
