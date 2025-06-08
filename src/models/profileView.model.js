const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connection');

class ProfileView extends Model {
    static associate(models) {
        ProfileView.belongsTo(models.User, {
            foreignKey: 'viewerId',
            as: 'viewer'
        });

        ProfileView.belongsTo(models.User, {
            foreignKey: 'viewedId',
            as: 'viewed'
        });
    }
}

ProfileView.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    viewerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    viewedId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    source: {
        type: DataTypes.ENUM('recommendations', 'search', 'browse'),
        defaultValue: 'recommendations'
    }
}, {
    sequelize,
    modelName: 'ProfileView',
    tableName: 'profile_views',
    underscored: true
});

module.exports = ProfileView;