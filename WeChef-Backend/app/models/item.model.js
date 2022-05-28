module.exports = (sequelize, Sequelize) => {
  const Item = sequelize.define("items", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    creator: {
      type: Sequelize.INTEGER
    },
    owner: {
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    collection_id: {
      type: Sequelize.INTEGER,

    },
    externalLink: {
      type: Sequelize.STRING,

    },
    description: {
      type: Sequelize.STRING,
    },
    properties: {
      type: Sequelize.JSON,
    },
    unlockable: {
      type: Sequelize.BOOLEAN,
    },
    unlockableContent: {
      type: Sequelize.STRING,
    },
    supply: {
      type: Sequelize.INTEGER,
    },
    asset: {
      type: Sequelize.STRING,
    },
    preview_img: {
      type: Sequelize.STRING,
    },
    tokenId: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false
    },
    asset_filetype: {
      type: Sequelize.STRING,
    },
    ipfs_cid: {
      type: Sequelize.STRING
    },
    blocked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  return Item;
};