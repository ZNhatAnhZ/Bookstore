module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('User', {
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
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('User');
    }
};