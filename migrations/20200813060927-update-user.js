'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'userName', { allowNull: false,type:Sequelize.STRING(255)});
    await queryInterface.changeColumn('Users', 'password', { allowNull: false,type:Sequelize.STRING(255)});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'userName', { allowNull: false,type:Sequelize.STRING(255)});
    await queryInterface.changeColumn('Users', 'password', { allowNull: false,type:Sequelize.STRING(255)});
  }
};
