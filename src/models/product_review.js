const { DataTypes } = require('sequelize');
require('../database/connection');

module.exports = sequelize.define('product_reviews', {
    review_product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    review_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    review_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    // Other model options go here
});

