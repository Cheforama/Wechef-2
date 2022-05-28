
const controller = require("../controllers/sign.controller");
// const passport = require('passport');
const authJwt = require("../middleware/authJwt");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/signup", authJwt.verifyToken, controller.signup);
  app.post("/api/connect", controller.connect);
  app.get("/api/profile", authJwt.verifyToken, controller.profile);
};