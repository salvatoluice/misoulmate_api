/**
 * Profile model
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connection');

class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     */
    static associate(models) {
        Profile.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

        Profile.hasMany(models.ProfileQuestion, {
            foreignKey: 'profile_id',
            as: 'questions'
        });
    }
}

Profile.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT
    },
    location: {
        type: DataTypes.STRING
    },
    occupation: {
        type: DataTypes.STRING
    },
    education: {
        type: DataTypes.STRING
    },
    height: {
        type: DataTypes.STRING
    },
    photos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    interests: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    languages: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    lookingFor: {
        type: DataTypes.STRING,
        field: 'looking_for'
    },
    showMe: {
        type: DataTypes.STRING,
        defaultValue: 'Everyone',
        field: 'show_me'
    },
    ageRange: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: [18, 65],
        field: 'age_range'
    },
    maxDistance: {
        type: DataTypes.INTEGER,
        defaultValue: 50,
        field: 'max_distance'
    },
    drinking: {
        type: DataTypes.STRING
    },
    smoking: {
        type: DataTypes.STRING
    },
    zodiac: {
        type: DataTypes.STRING
    },
    instagram: {
        type: DataTypes.STRING
    },
    spotifyArtists: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        field: 'spotify_artists'
    },
    lastActive: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'last_active'
    }
}, {
    sequelize,
    modelName: 'Profile',
    tableName: 'profiles',
    underscored: true
});

module.exports = Profile;