const { DataTypes } = require('sequelize');
require('../database/connection');

module.exports = sequelize.define('shop', {
    shop_owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    // Other model options go here
});

