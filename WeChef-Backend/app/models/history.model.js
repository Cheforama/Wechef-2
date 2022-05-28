module.exports = (sequelize, Sequelize) => {
    const History = sequelize.define("histories", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        event: {
            type: Sequelize.STRING,
            defaultValue: ''
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        from: {
            type: Sequelize.STRING,

        },
        to: {
            type: Sequelize.STRING,

        },
        price: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        token_id: {
            type: Sequelize.INTEGER,

        },

    });

    return History;
};