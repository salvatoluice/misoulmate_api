const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connection');

class Like extends Model {
    static associate(models) {
        Like.belongsTo(models.User, {
            foreignKey: 'liker_id',
            as: 'liker'
        });

        Like.belongsTo(models.User, {
            foreignKey: 'liked_id',
            as: 'liked'
        });
    }
}

Like.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    likerId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'liker_id'
    },
    likedId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'liked_id'
    },
    status: {
        type: DataTypes.ENUM('like', 'dislike', 'superlike'),
        allowNull: false,
        defaultValue: 'like'
    }
}, {
    sequelize,
    modelName: 'Like',
    tableName: 'likes',
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['liker_id', 'liked_id']
        }
    ]
});

module.exports = Like;