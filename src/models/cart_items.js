const { DataTypes } = require('sequelize');
require('../database/connection');

module.exports = sequelize.define('cart_items', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    // Other model options go here
});

