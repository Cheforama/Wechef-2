module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define("admin", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    password: {
      type: Sequelize.STRING,
      required: true
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: 'ADMIN'
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  });

  return Admin;
};