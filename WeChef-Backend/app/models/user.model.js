module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    email: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    wallet: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    profile_img: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    allowed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  return User;
};