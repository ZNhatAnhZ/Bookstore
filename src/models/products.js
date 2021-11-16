const { DataTypes } = require('sequelize');
require('../database/connection');

module.exports = sequelize.define('products', {
    product_category: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    product_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_details: {
        type: DataTypes.STRING,
        allowNull: false
    },
    product_photo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    provider_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    // Other model options go here
});

