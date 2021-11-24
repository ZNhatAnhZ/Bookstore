const { DataTypes } = require('sequelize');
require('../database/connection');

module.exports = sequelize.define('order_items', {
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    // Other model options go here
});

