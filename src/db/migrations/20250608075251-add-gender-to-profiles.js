'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('profiles', 'gender', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'age'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('profiles', 'gender');
  }
};