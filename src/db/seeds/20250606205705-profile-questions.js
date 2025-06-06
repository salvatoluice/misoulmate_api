'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get the profile we created in the profiles seed
    const profiles = await queryInterface.sequelize.query(
      'SELECT p.id FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.email = :email',
      {
        replacements: { email: 'test@example.com' },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (!profiles.length) return;

    const profileId = profiles[0].id;

    return queryInterface.bulkInsert('profile_questions', [
      {
        id: uuidv4(),
        profile_id: profileId,
        question: 'My ideal weekend includes...',
        answer: 'A morning hike, exploring a new neighborhood, and cooking dinner with friends.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        profile_id: profileId,
        question: 'I value most in a relationship...',
        answer: 'Trust, good communication, and making each other laugh.',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('profile_questions', null, {});
  }
};