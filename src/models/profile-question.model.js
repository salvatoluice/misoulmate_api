/**
 * Profile Question model
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connection');

class ProfileQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     */
    static associate(models) {
        ProfileQuestion.belongsTo(models.Profile, {
            foreignKey: 'profile_id',
            as: 'profile'
        });
    }
}

ProfileQuestion.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    profileId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'profile_id'
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'ProfileQuestion',
    tableName: 'profile_questions',
    underscored: true
});

module.exports = ProfileQuestion;