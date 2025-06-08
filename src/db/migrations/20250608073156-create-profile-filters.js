// migrations/YYYYMMDDHHMMSS-create-profile-filters.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profile_filters', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      filtered_profile_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      reason: {
        type: Sequelize.ENUM('notInterested', 'inappropriate', 'fake', 'other'),
        allowNull: false
      },
      details: {
        type: Sequelize.STRING(500),
        allowNull: true
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

    // Add unique constraint to prevent duplicate filters
    await queryInterface.addConstraint('profile_filters', {
      fields: ['user_id', 'filtered_profile_id'],
      type: 'unique',
      name: 'unique_user_filtered_profile'
    });

    // Add indexes for faster queries
    await queryInterface.addIndex('profile_filters', ['user_id']);
    await queryInterface.addIndex('profile_filters', ['filtered_profile_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('profile_filters');
  }
};