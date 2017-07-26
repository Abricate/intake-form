'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    await queryInterface.createTable('admins', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      googleId: Sequelize.STRING,
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      lastLogin: Sequelize.DATE,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    await queryInterface.addIndex('admins', ['email'] , { indicesType: 'UNIQUE' });
    await queryInterface.addIndex('admins', ['googleId']);
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.dropTable('admins');
  }
};
