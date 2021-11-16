const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('e-commerce', 'root', '1892001', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        freezeTableName: true,
        timestamps: false
    }
});

module.exports = sequelize;
global.sequelize = sequelize;