// migrations/YYYYMMDDHHMMSS-create-profile-views.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profile_views', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      viewer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      viewed_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      source: {
        type: Sequelize.ENUM('recommendations', 'search', 'browse'),
        defaultValue: 'recommendations'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes for faster queries
    await queryInterface.addIndex('profile_views', ['viewer_id']);
    await queryInterface.addIndex('profile_views', ['viewed_id']);
    await queryInterface.addIndex('profile_views', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('profile_views');
  }
};