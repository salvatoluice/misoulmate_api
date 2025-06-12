'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('subscriptions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
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
      plan: {
        type: Sequelize.ENUM('basic', 'gold', 'platinum', 'diamond'),
        defaultValue: 'basic',
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'cancelled', 'expired', 'paused'),
        defaultValue: 'active',
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      auto_renew: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      billing_cycle: {
        type: Sequelize.ENUM('monthly', 'yearly'),
        defaultValue: 'monthly',
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cancel_reason: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cancel_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      last_billing_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      next_billing_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('subscriptions', ['user_id']);
    await queryInterface.addIndex('subscriptions', ['plan', 'status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('subscriptions');
  }
};