const { DataTypes } = require('sequelize');
require('../database/connection');

module.exports = sequelize.define('category', {
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
});

