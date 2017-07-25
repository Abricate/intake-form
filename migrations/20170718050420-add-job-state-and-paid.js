'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    await queryInterface.addColumn('jobs', 'state', Sequelize.STRING);
    await queryInterface.addIndex('jobs', ['state']);
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.removeColumn('jobs', 'state');
  }
};
