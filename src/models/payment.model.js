const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connection');

class Payment extends Model {
    static associate(models) {
        Payment.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

        Payment.belongsTo(models.Subscription, {
            foreignKey: 'subscription_id',
            as: 'subscription'
        });
    }
}

Payment.init({
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
    subscriptionId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'subscription_id'
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD'
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'payment_method'
    },
    paymentId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'payment_id'
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending'
    },
    transactionData: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'transaction_data'
    }
}, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    underscored: true
});

module.exports = Payment;