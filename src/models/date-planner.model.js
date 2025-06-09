// models/datePlan.js
'use strict';

module.exports = (sequelize, DataTypes) => {
    const DatePlan = sequelize.define('DatePlan', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        matchId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'match_id'
        },
        creatorId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'creator_id'
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        locationDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            field: 'location_details'
        },
        dateTime: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'date_time'
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'end_time'
        },
        status: {
            type: DataTypes.ENUM('proposed', 'confirmed', 'declined', 'canceled', 'completed'),
            defaultValue: 'proposed',
            allowNull: false
        },
        responseBy: {
            type: DataTypes.UUID,
            allowNull: true,
            field: 'response_by'
        },
        responseAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'response_at'
        }
    }, {
        tableName: 'date_plans',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    DatePlan.associate = function (models) {
        // Associations
        DatePlan.belongsTo(models.Match, {
            foreignKey: 'match_id',
            as: 'match'
        });

        DatePlan.belongsTo(models.User, {
            foreignKey: 'creator_id',
            as: 'creator'
        });

        DatePlan.belongsTo(models.User, {
            foreignKey: 'response_by',
            as: 'responder'
        });
    };

    return DatePlan;
};