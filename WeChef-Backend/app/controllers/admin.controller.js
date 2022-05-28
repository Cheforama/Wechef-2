const config = require("../config/auth.config");
const db = require("../models");
const Admin = db.admin;
const User = db.user;
const Item = db.item;
const ReportHistory = db.report;
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let admin = await Admin.findOne({
      where: {
        email: req.body.email
      }
    });
    if (admin) {
      return res.status(400).json({
        errors: [
          {
            msg: "Email already exists",
            param: "email",
            location: "body",
            value: req.body.email
          },
        ],
      });
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        errors: [
          {
            msg: "Password does not match",
            param: "password",
            location: "body",
            value: req.body.password
          },
        ],
      });
    }

    const hash = await bcrypt.hash(req.body.password, 12);
    const newUser = await Admin.create({
      email: req.body.email,
      password: hash
    });
    return res.json(newUser);
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let admin = await Admin.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!admin) {
      return res.status(400).json({
        errors: [
          {
            msg: "Email does not exist",
            param: "email",
            location: "body",
            value: req.body.email
          },
        ],
      });
    }
    const passwordIsCorrect = await bcrypt.compare(req.body.password, admin.password);
    if (!passwordIsCorrect) {
      return res.status(400).json({
        errors: [
          {
            msg: "Incorrect password",
            param: "password",
            location: "body",
            value: req.body.password
          },
        ],
      });
    }
    if (admin.status === 0) {
      return res.status(400).json({
        errors: [
          {
            msg: "You are not allowed admin authorization.",
            param: "email",
            location: "body",
            value: req.body.email
          },
        ],
      });
    }

    const payload = {
      id: admin.id,
      role: admin.role
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 86400000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    return res.status(500).json({
      errors: [
        {
          msg: "Server error",
          param: "email",
          location: "body",
        },
      ],
    });
  }
}

exports.profile = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        wallet: req.query.address
      }
    });

    return res.json(user);
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }
}

exports.connect = async (req, res) => {
  try {
    let isValid = true;
    if (req.body.address === undefined || req.body.address === null) {
      isValid = false;
    }
    if (!isValid) {
      return res.status(400).json({ errors: 'Wallet address is required' });
    }

    let user = await User.findOne({ where: { wallet: req.body.address } });
    if (!user) {
      user = await User.create({
        username: 'unnamed',
        wallet: req.body.address,
      })
    }

    var token = jwt.sign({
      id: user.id,
      name: user.username,
      email: user.email,
      address: user.wallet,
      profile: user.profile_img
    }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).send({
      accessToken: token
    });
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: err.message });
  }
}

exports.getUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

exports.getUsers = async (req, res) => {
  try {

    var sql1 = "select * from users where wallet <> '0x0000000000000000000000000000000000000000'";
    if (req.query.checked === 'true') {
      sql1 += " and allowed = true";
    }
    if (req.query.filterKey !== '') {
      sql1 += " and (LOWER(username) like LOWER('%" + req.query.filterKey + "%') or LOWER(wallet) like LOWER('%" + req.query.filterKey + "%')) or LOWER(email) like LOWER('%" + req.query.filterKey + "%')";
    }
    sql1 += " limit :limit offset :offset";
    const result1 = await db.sequelize.query(sql1, {
      replacements: { limit: Number(req.query.pagesize), offset: Number(req.query.pagesize) * Number(req.query.pagenum) }
    });

    var sql2 = "select count(*) as cnt from users where wallet <> '0x0000000000000000000000000000000000000000'";
    if (req.query.checked === 'true') {
      sql2 += " and allowed = true";
    }
    if (req.query.filterKey !== '') {
      sql2 += " and (LOWER(username) like LOWER('%" + req.query.filterKey + "%') or LOWER(wallet) like LOWER('%" + req.query.filterKey + "%')) or LOWER(email) like LOWER('%" + req.query.filterKey + "%')";
    }
    const result2 = await db.sequelize.query(sql2);

    return res.json({ result1, result2 });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Server error' });
  }
}

exports.saveAllowStatus = async (req, res) => {
  try {
    const { id, allow } = req.body;

    let user = await User.findByPk(id);
    user.allowed = allow;
    await user.save();

    return res.json({ success: true });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Server error' });
  }
}

exports.saveBlockStatus = async (req, res) => {
  try {
    const { id, blocked } = req.body;

    const item = await Item.findByPk(id);
    item.blocked = blocked;
    await item.save();

    return res.json({ success: true });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Server error' });
  }
}

exports.getItems = async (req, res) => {
  try {
    const { page, rowsPerPage, tokenId, checked } = req.query;
    console.log(req.query);

    let sql1 = 'select tb1.*, COALESCE(tb2.cnt, 0) as report_count from (' +
      'select a.*, b.name as collection_name, c.username as owner_name, c.wallet as owner_wallet ' +
      'from items a, collections b, users c ' +
      'where a.collection_id = b.id and a.owner = c.id' +
      ') tb1 left join(' +
      'select report_item, count(*) as cnt from reports group by report_item' +
      ') tb2 on tb1.id = tb2.report_item where 1=1';
    if (checked === 'true') {
      sql1 += ' and tb1.blocked = false';
    }
    if (tokenId !== '') {
      sql1 += ' and tb1."tokenId" = ' + tokenId;
    }
    sql1 += ' limit :limit offset :offset';
    const result1 = await db.sequelize.query(sql1, {
      replacements: { limit: Number(rowsPerPage), offset: Number(page) * Number(rowsPerPage) }
    });

    let sql2 = "select count(*) as cnt from items a, collections b where a.collection_id = b.id";
    if (checked === 'true') {
      sql2 += " and a.blocked = false";
    }
    if (tokenId !== '') {
      sql2 += ' and a."tokenId" = ' + tokenId
    }
    const result2 = await db.sequelize.query(sql2);

    return res.json({ result1, result2 });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Server error' });
  }
}

exports.getReportList = async (req, res) => {
  try {

    let reportHistory = await ReportHistory.findAll({
      where: {
        report_item: req.params.id
      },
      include: [{ model: User, as: 'user' }]
    });
    return res.json(reportHistory);
  } catch (err) {
    return res.status(500).json(err.message);
  }
}

exports.getAdminList = async (req, res) => {
  try {
    const admin = await Admin.findAll({
      where: {
        role: "ADMIN"
      }
    });
    return res.json(admin)
  } catch (err) {
    return res.status(500).json(err.message);
  }
}

exports.setAllowStatus = async (req, res) => {
  try {
    if (req.user.role !== 'SUPER_ADMIN') {
      return res.json({ success: false, message: 'Not allowed permission' });
    }
    const admin = await Admin.findByPk(req.body.id);
    admin.status = req.body.allow;
    await admin.save();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json(err.message);
  }
}

exports.saveAccount = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.user.id);
    if (admin) {
      admin.email = req.body.email;
      if (req.body.password) {
        const hash = await bcrypt.hash(req.body.password, 12);
        admin.password = hash;
      }
      await admin.save();
      return res.json({ success: true });
    }
  } catch (err) {
    return res.status(500).json(err.message);
  }
}