'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  class Duty extends Model {
    /**
     * 定义关联的辅助方法。
     * 此方法不是Sequelize生命周期的一部分。
     * 模型/索引文件将自动调用此方法。
     */
    static associate(models) {
      const {Duty,Roles, MenuModel} = models;
      Duty.belongsToMany(MenuModel, {through: 'DutyMenuModel', as: 'children'})
      Duty.belongsToMany(Roles, {through: 'rolesDuty'})
  // sequelize.sync({alter: true})
    }
  };
  Duty.init({
    code: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '职责编码不能为空'
        }
      }
    },
    name: DataTypes.STRING,
    creator: DataTypes.STRING,
    creatorId: DataTypes.STRING,
    status: DataTypes.STRING,
    currentAuthority: DataTypes.STRING(1234),
    menuId: DataTypes.STRING,
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
    modelName: 'Duty',
  });
  // (async () => {
  //   await Duty.sync({ alter: true })
  // })()
  return Duty;
};
