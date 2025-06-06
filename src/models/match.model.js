const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connection');

class Match extends Model {
    static associate(models) {
        Match.belongsTo(models.User, {
            foreignKey: 'user1_id',
            as: 'user1'
        });

        Match.belongsTo(models.User, {
            foreignKey: 'user2_id',
            as: 'user2'
        });

        Match.belongsTo(models.User, {
            foreignKey: 'unmatched_by',
            as: 'unmatchedBy'
        });

        Match.hasMany(models.Message, {
            foreignKey: 'match_id',
            as: 'messages'
        });
    }
}

Match.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user1Id: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user1_id'
    },
    user2Id: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user2_id'
    },
    status: {
        type: DataTypes.ENUM('active', 'paused', 'unmatched'),
        defaultValue: 'active'
    },
    compatibilityScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'compatibility_score',
        validate: {
            min: 0,
            max: 100
        }
    },
    lastMessageAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_message_at'
    },
    unmatchedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'unmatched_by'
    },
    unmatchedReason: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'unmatched_reason'
    }
}, {
    sequelize,
    modelName: 'Match',
    tableName: 'matches',
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['user1_id', 'user2_id']
        }
    ]
});

module.exports = Match;