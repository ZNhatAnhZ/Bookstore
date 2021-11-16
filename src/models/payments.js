const { DataTypes } = require('sequelize');
require('../database/connection');

module.exports = sequelize.define('payments', {
    payment_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    // Other model options go here
});

