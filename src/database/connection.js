const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('e-commerce', 'root', '123456789', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        freezeTableName: true,
        timestamps: false
    },
    port: 3307
});

module.exports = sequelize;
global.sequelize = sequelize;