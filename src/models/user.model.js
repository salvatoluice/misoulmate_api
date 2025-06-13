const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connection');
const { hashPassword } = require('../utils/crypto');

class User extends Model {
    static associate(models) {
        User.hasOne(models.Profile, {
            foreignKey: 'user_id',
            as: 'profile'
        });
    }

    async isPasswordMatch(password, utils) {
        return await utils.verifyPassword(password, this.password);
    }
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verificationToken: {
        type: DataTypes.STRING,
        field: 'verification_token'
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        field: 'reset_password_token'
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        field: 'reset_password_expires'
    },
    lastLogin: {
        type: DataTypes.DATE,
        field: 'last_login'
    },
    subscription: {
        type: DataTypes.ENUM('Basic', 'Gold', 'Platinum', 'Diamond'),
        defaultValue: 'Basic'
    },
    notifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    hooks: {
        beforeSave: async (user) => {
            if (user.changed('password')) {
                user.password = await hashPassword(user.password);
            }
        }
    }
});

module.exports = User;