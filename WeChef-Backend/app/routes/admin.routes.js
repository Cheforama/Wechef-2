const { Router } = require('express')
const controller = require("../controllers/admin.controller");
// const passport = require('passport');
const { check } = require('express-validator');
const adminAuthJwt = require("../middleware/adminAuthJwt");

module.exports = function (app) {

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/admin/auth/signup", [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Please provide a password").notEmpty(),
    check("confirmPassword", "Please provide a confirm password").notEmpty(),
  ], controller.signup);

  app.post("/api/admin/auth/login", [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Please provide a password").notEmpty()
  ], controller.login);

  app.get('/api/admin/auth', adminAuthJwt.verifyToken, controller.getUser);

  app.get('/api/admin/users', adminAuthJwt.verifyToken, controller.getUsers);

  app.post('/api/admin/users/allow', adminAuthJwt.verifyToken, controller.saveAllowStatus);

  app.get('/api/admin/items', adminAuthJwt.verifyToken, controller.getItems);

  app.post('/api/admin/items/block', adminAuthJwt.verifyToken, controller.saveBlockStatus);

  app.get('/api/admin/items/reports/:id', adminAuthJwt.verifyToken, controller.getReportList);

  app.get('/api/admin', adminAuthJwt.verifyToken, controller.getAdminList);

  app.post('/api/admin/allow', adminAuthJwt.verifyToken, controller.setAllowStatus);

  app.put('/api/admin/account', adminAuthJwt.verifyToken, controller.saveAccount);

};