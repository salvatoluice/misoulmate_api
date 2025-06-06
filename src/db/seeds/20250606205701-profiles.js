// src/db/seeds/XXXXXXXXXXXXXX-profiles.js
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get the user we created in the users seed
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE email = :email',
      {
        replacements: { email: 'test2@example.com' },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (!users.length) return;

    const userId = users[0].id;
    const profileId = uuidv4();

    return queryInterface.bulkInsert('profiles', [{
      id: profileId,
      user_id: userId,
      name: 'Alex Johnson',
      age: 29,
      bio: 'Product designer by day, amateur chef by night. Love hiking, travel photography, and finding the best coffee shops in town.',
      location: 'San Francisco, CA',
      occupation: 'Senior Product Designer at TechCorp',
      education: 'MFA in Design, RISD',
      height: '5\'10"',
      // Use PostgreSQL array syntax with curly braces
      photos: '{https://images.unsplash.com/photo-1519085360753-af0119f7cbe7,https://images.unsplash.com/photo-1501196354995-cbb51c65aaea,https://images.unsplash.com/photo-1551632811-561732d1e306,https://images.unsplash.com/photo-1511988617509-a57c8a288659}',
      interests: '{Photography,Cooking,Hiking,Travel,Coffee,Design}',
      languages: '{English,Spanish}',
      looking_for: 'Relationship',
      show_me: 'Women',
      age_range: '{25,35}',
      max_distance: 25,
      drinking: 'Social drinker',
      smoking: 'Never',
      zodiac: 'Libra',
      instagram: '@alex.designs',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('profiles', null, {});
  }
};