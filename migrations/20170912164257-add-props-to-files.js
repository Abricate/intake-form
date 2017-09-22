'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    await queryInterface.addColumn('box_files', 'props', Sequelize.JSONB);
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.removeColumn('box_files', 'props');
  }
};
