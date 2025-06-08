const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connection');

class ProfileReport extends Model {
    static associate(models) {
        ProfileReport.belongsTo(models.User, {
            foreignKey: 'reporterId',
            as: 'reporter'
        });

        ProfileReport.belongsTo(models.User, {
            foreignKey: 'reportedId',
            as: 'reported'
        });

        ProfileReport.belongsTo(models.User, {
            foreignKey: 'reviewedBy',
            as: 'reviewer'
        });
    }
}

ProfileReport.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    reporterId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    reportedId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    reason: {
        type: DataTypes.ENUM('inappropriate', 'fake', 'offensive', 'underageSuspicion', 'spam', 'other'),
        allowNull: false
    },
    details: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'reviewed', 'actioned', 'dismissed'),
        defaultValue: 'pending'
    },
    reviewedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'ProfileReport',
    tableName: 'profile_reports',
    underscored: true
});

module.exports = ProfileReport;