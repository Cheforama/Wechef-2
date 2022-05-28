module.exports = (sequelize, Sequelize) => {
  const Collection = sequelize.define("collections", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    creator: {
      type: Sequelize.INTEGER,
    },
    total_items: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    total_owners: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    floor_price: {
      type: Sequelize.FLOAT,
      defaultValue: 0
    },
    logo_img: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    banner_img: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    description: {
      type: Sequelize.STRING,
      defaultValue: ''
    }
  });

  return Collection;
};