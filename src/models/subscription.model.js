const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db/connection');

class Subscription extends Model {
    static associate(models) {
        Subscription.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

        if (models.Payment) {
            Subscription.hasMany(models.Payment, {
                foreignKey: 'subscription_id',
                as: 'payments'
            });
        }
    }
}

Subscription.init({
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
    plan: {
        type: DataTypes.ENUM('basic', 'gold', 'platinum', 'diamond'),
        defaultValue: 'basic',
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'cancelled', 'expired', 'paused'),
        defaultValue: 'active',
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'start_date'
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'end_date'
    },
    autoRenew: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'auto_renew'
    },
    billingCycle: {
        type: DataTypes.ENUM('monthly', 'yearly'),
        defaultValue: 'monthly',
        allowNull: false,
        field: 'billing_cycle'
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'payment_method'
    },
    paymentId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'payment_id'
    },
    cancelReason: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'cancel_reason'
    },
    cancelDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'cancel_date'
    },
    lastBillingDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_billing_date'
    },
    nextBillingDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'next_billing_date'
    }
}, {
    sequelize,
    modelName: 'Subscription',
    tableName: 'subscriptions',
    underscored: true,
    indexes: [
        {
            fields: ['user_id']
        },
        {
            fields: ['plan', 'status']
        }
    ]
});

module.exports = Subscription;