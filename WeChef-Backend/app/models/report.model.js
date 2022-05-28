module.exports = (sequelize, Sequelize) => {
    const ReportHistory = sequelize.define("reports", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        report_user: {
            type: Sequelize.INTEGER,
        },
        report_item: {
            type: Sequelize.INTEGER,
        },
        reason: {
            type: Sequelize.STRING,
            defaultValue: ''
        }
    });

    return ReportHistory;
};