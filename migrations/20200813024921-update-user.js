'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
    *  删除Users表中的字段
    *  queryInterface.removeColumn(表名称, 字段名)
    *  添加Users表中的字段
    *  queryInterface.addColumn('表名称, 字段名, 字段类型);
    * */
    await queryInterface.removeColumn('Users', 'lastName');
    await queryInterface.removeColumn();
    await queryInterface.addColumn('Users', 'name', Sequelize.STRING(255));
    await queryInterface.addColumn('Users', 'age', Sequelize.INTEGER);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.removeColumn('Users', 'lastName');
    await queryInterface.addColumn('Users', 'name', Sequelize.STRING(255));
    await queryInterface.addColumn('Users', 'age', Sequelize.INTEGER);
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
