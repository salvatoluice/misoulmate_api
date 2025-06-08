const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connection');

class ProfileFilter extends Model {
    static associate(models) {
        ProfileFilter.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });

        ProfileFilter.belongsTo(models.User, {
            foreignKey: 'filteredProfileId',
            as: 'filteredProfile'
        });
    }
}

ProfileFilter.init({
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
    filteredProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    reason: {
        type: DataTypes.ENUM('notInterested', 'inappropriate', 'fake', 'other'),
        allowNull: false
    },
    details: {
        type: DataTypes.STRING(500),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'ProfileFilter',
    tableName: 'profile_filters',
    underscored: true
});

module.exports = ProfileFilter;