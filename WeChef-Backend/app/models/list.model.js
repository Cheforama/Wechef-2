module.exports = (sequelize, Sequelize) => {
    const List = sequelize.define("lists", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        reservedAddress: {
            type: Sequelize.STRING,
        },
        user_id: {
            type: Sequelize.INTEGER,
        },
        from: {
            type: Sequelize.DATE,
        },
        to: {
            type: Sequelize.DATE,
        },
        price: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        tokenId: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    });

    return List;
};