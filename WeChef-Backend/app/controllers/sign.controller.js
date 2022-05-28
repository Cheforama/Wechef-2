const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
  try {
    let filename = '';
    if (req.files) {
      const newpath = path.join(__dirname, `../upload/profile`);
      const extension = (path.extname(req.files.image.name)).toLowerCase();
      if (!fs.existsSync(newpath)) {
        fs.mkdir(newpath, { recursive: true }, function (err) {
          if (err) {
            console.log(err)
          } else {
            console.log("Upload directory successfully created.")
          }
        })
      }
      filename = req.body.address + `${extension}`;
      const file = req.files.image;
      await file.mv(`${newpath}/${filename}`);
    }

    let user = await User.findOne({
      where: {
        wallet: req.body.address
      }
    });

    if (user) {
      user.username = req.body.username;
      user.email = req.body.email;
      user.wallet = req.body.address;
      if (req.files) {
        user.profile_img = filename;
      }
      await user.save();
      return res.json(user);
    } else {
      const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        wallet: req.body.address,
        profile_img: filename,
      })
      return res.json(newUser);
    }
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }
};


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
