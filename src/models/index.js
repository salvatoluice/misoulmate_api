const User = require('./user.model');
const Profile = require('./profile.model');
const ProfileQuestion = require('./profile-question.model');
const Match = require('./match.model');
const Like = require('./like.model');

const setupAssociations = () => {
    User.associate({ Profile });
    Profile.associate({ User, ProfileQuestion });
    ProfileQuestion.associate({ Profile });
    Match.associate({ User });
    Like.associate({ User });
};

setupAssociations();

module.exports = {
    User,
    Profile,
    ProfileQuestion,
    Match,
    Like
};