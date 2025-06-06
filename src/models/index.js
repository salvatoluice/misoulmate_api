/**
 * Export all models
 */
const User = require('./user.model');
const Profile = require('./profile.model');
const ProfileQuestion = require('./profile-question.model');

// Set up associations
const setupAssociations = () => {
    User.associate({ Profile });
    Profile.associate({ User, ProfileQuestion });
    ProfileQuestion.associate({ Profile });
};

// Call the function to set up associations
setupAssociations();

module.exports = {
    User,
    Profile,
    ProfileQuestion
};