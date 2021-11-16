const { DataTypes } = require('sequelize');
require('../database/connection');

module.exports = sequelize.define('orders', {
    order_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_amount: {
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

