'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profiles', {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      occupation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      education: {
        type: Sequelize.STRING,
        allowNull: true
      },
      height: {
        type: Sequelize.STRING,
        allowNull: true
      },
      photos: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      interests: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      languages: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      looking_for: {
        type: Sequelize.STRING,
        allowNull: true
      },
      show_me: {
        type: Sequelize.STRING,
        defaultValue: 'Everyone'
      },
      age_range: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: [18, 65]
      },
      max_distance: {
        type: Sequelize.INTEGER,
        defaultValue: 50
      },
      drinking: {
        type: Sequelize.STRING,
        allowNull: true
      },
      smoking: {
        type: Sequelize.STRING,
        allowNull: true
      },
      zodiac: {
        type: Sequelize.STRING,
        allowNull: true
      },
      instagram: {
        type: Sequelize.STRING,
        allowNull: true
      },
      spotify_artists: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      last_active: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('profiles');
  }
};