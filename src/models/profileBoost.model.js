const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connection');

class ProfileBoost extends Model {
    static associate(models) {
        ProfileBoost.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    }
}

ProfileBoost.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    boostType: {
        type: DataTypes.ENUM('standard', 'premium'),
        defaultValue: 'standard'
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'ProfileBoost',
    tableName: 'profile_boosts',
    underscored: true
});

module.exports = ProfileBoost;