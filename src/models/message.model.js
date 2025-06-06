const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connection');

class Message extends Model {
    static associate(models) {
        Message.belongsTo(models.Match, {
            foreignKey: 'match_id',
            as: 'match'
        });

        Message.belongsTo(models.User, {
            foreignKey: 'sender_id',
            as: 'sender'
        });
    }
}

Message.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    matchId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'match_id'
    },
    senderId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'sender_id'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    mediaUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'media_url'
    },
    mediaType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'media_type'
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_read'
    },
    readAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'read_at'
    }
}, {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    underscored: true,
    indexes: [
        {
            fields: ['match_id']
        },
        {
            fields: ['sender_id']
        },
        {
            fields: ['is_read']
        },
        {
            fields: ['created_at']
        }
    ]
});

module.exports = Message;