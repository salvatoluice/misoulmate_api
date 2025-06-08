// migrations/YYYYMMDDHHMMSS-create-profile-boosts.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profile_boosts', {
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
      boost_type: {
        type: Sequelize.ENUM('standard', 'premium'),
        defaultValue: 'standard'
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
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

    // Add index for faster queries
    await queryInterface.addIndex('profile_boosts', ['user_id']);
    await queryInterface.addIndex('profile_boosts', ['expires_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('profile_boosts');
  }
};


