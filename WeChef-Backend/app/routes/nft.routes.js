const controller = require("../controllers/nft.controller");
const authJwt = require("../middleware/authJwt");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/item/create", authJwt.verifyToken, controller.createItem);
  app.get("/api/item", authJwt.verifyToken, controller.getItem);
  app.get("/api/item/:id", authJwt.verifyToken, controller.getItemDetail);
  app.post("/api/item/popular", controller.getPopularItems);
  app.post('/api/item/changeOwner', authJwt.verifyToken, controller.changeItemOwner);
  app.post('/api/item/check_create', authJwt.verifyToken, controller.checkCreateItem);
  app.post('/api/item/all', controller.getAllItems);
  app.post('/api/item/my_items', controller.getMyItems);
  app.post('/api/check_item/:id', authJwt.verifyToken, controller.checkItem);
  app.post('/api/item/report', authJwt.verifyToken, controller.reportItem);

  app.post("/api/collection/checkstate", authJwt.verifyToken, controller.checkState);
  app.post("/api/collection/create", authJwt.verifyToken, controller.createCollection);
  app.get("/api/collection", controller.getCollections);
  app.get("/api/collections/", authJwt.verifyToken, controller.getMyCollection);
  app.get('/api/collection/:id', authJwt.verifyToken, controller.getCollectionDetail);

  app.post("/api/history/create", authJwt.verifyToken, controller.createHistory);
  app.get("/api/history/:id", authJwt.verifyToken, controller.getHistory);
  app.post("/api/history", authJwt.verifyToken, controller.insertBuyHistory);
  app.get("/api/history", controller.getAllHistory);

  app.post("/api/list/create", authJwt.verifyToken, controller.createList);
  app.get("/api/list/:id", authJwt.verifyToken, controller.getList);
  app.post("/api/list", authJwt.verifyToken, controller.insertListHistory);
  app.post("/api/list/update_lists", authJwt.verifyToken, controller.updateListHistory);

};