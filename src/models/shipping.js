const { DataTypes } = require('sequelize');
require('../database/connection');

module.exports = sequelize.define('shipping', {
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    required_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    shipped_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    // Other model options go here
});

