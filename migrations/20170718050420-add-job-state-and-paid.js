'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    await queryInterface.addColumn('jobs', 'state', Sequelize.STRING);
    await queryInterface.addIndex('jobs', ['state']);
    await queryInterface.addColumn('jobs', 'paid', { type: Sequelize.BOOLEAN, defaultValue: false });
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.removeColumn('jobs', 'state');
    await queryInterface.removeColumn('jobs', 'paid');
  }
};
