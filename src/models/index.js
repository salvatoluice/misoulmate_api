const User = require('./user.model');
const Profile = require('./profile.model');
const ProfileQuestion = require('./profile-question.model');
const Match = require('./match.model');
const Like = require('./like.model');
const Message = require('./message.model');
const ProfileBoost = require('./profileBoost.model');
const ProfileView = require('./profileView.model');
const ProfileFilter = require('./profileFilter.model');
const ProfileReport = require('./profileReport.model');

const models = {
    User,
    Profile,
    ProfileQuestion,
    Match,
    Like,
    Message,
    ProfileBoost,
    ProfileView,
    ProfileFilter,
    ProfileReport
};

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = models;