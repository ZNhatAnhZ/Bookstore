const { DataTypes } = require('sequelize');
require('../database/connection');

module.exports = sequelize.define('users', {
    user_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
});

