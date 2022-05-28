const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.collection = require("./collection.model.js")(sequelize, Sequelize);
db.item = require("./item.model.js")(sequelize, Sequelize);
db.history = require("./history.model.js")(sequelize, Sequelize);
db.list = require("./list.model.js")(sequelize, Sequelize);
db.admin = require('./admin.model')(sequelize, Sequelize);
db.report = require('./report.model')(sequelize, Sequelize);

db.user.hasMany(db.collection, { as: "collection", foreignKey: "creator", sourceKey: 'id' });
db.collection.belongsTo(db.user, { as: "user", foreignKey: "creator", targetKey: 'id' });

db.user.hasMany(db.item, { as: "item", foreignKey: "owner", sourceKey: 'id' });
db.item.belongsTo(db.user, { as: "user", foreignKey: "owner", targetKey: 'id' });

db.collection.hasMany(db.item, { as: "item", foreignKey: "collection_id", sourceKey: 'id' });
db.item.belongsTo(db.collection, { as: "collection", foreignKey: "collection_id", targetKey: 'id' });

db.user.hasMany(db.history, { as: "history", foreignKey: "user_id", sourceKey: 'id', allowNull: false });
db.history.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: 'id', allowNull: false });

db.user.hasMany(db.history, { as: "tohistory", foreignKey: "to", sourceKey: 'wallet', allowNull: false });
db.history.belongsTo(db.user, { as: "touser", foreignKey: "to", targetKey: 'wallet', allowNull: false });

db.user.hasMany(db.history, { as: "fromhistory", foreignKey: "from", sourceKey: 'wallet', allowNull: false });
db.history.belongsTo(db.user, { as: "fromuser", foreignKey: "from", targetKey: 'wallet', allowNull: false });

db.item.hasMany(db.history, { as: "history", foreignKey: "token_id", sourceKey: 'tokenId' });
db.history.belongsTo(db.item, { as: "item", foreignKey: "token_id", targetKey: 'tokenId', });

db.user.hasMany(db.list, { as: "list", foreignKey: "user_id", sourceKey: 'id' });
db.list.belongsTo(db.user, { as: "user", foreignKey: "user_id", targetKey: 'id' });

db.item.hasMany(db.report, { as: 'report', foreignKey: 'report_item', sourceKey: 'id', allowNull: false });
db.report.belongsTo(db.item, { as: 'item', foreignKey: 'report_item', sourceKey: 'id', allowNull: false });

db.user.hasMany(db.report, { as: 'report', foreignKey: 'report_user', sourceKey: 'id', allowNull: false });
db.report.belongsTo(db.user, { as: 'user', foreignKey: 'report_user', sourceKey: 'id', allowNull: false });

module.exports = db;