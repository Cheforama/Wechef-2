const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileupload = require('express-fileupload');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(fileupload());

const db = require("./app/models");

async function setMintAddress() {
  try {

    await db.sequelize.sync();
    const User = db.user;

    let user = await User.findOne({
      where: {
        wallet: '0x0000000000000000000000000000000000000000'
      }
    });

    if (!user) {
      await User.create({
        username: 'Unnamed',
        email: '',
        wallet: '0x0000000000000000000000000000000000000000',
        profile_img: '',
      })
    }

  }
  catch (err) {
    console.log(err)
  }
}

setMintAddress()


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Wechef application." });
});

app.get('/upload/:dirpath/:filename', async (req, res) => {
  const dirpath = req.params.dirpath;
  const filename = req.params.filename;

  res.sendFile(path.join(__dirname, './app/upload/' + dirpath + '/' + filename));
})

// routes
require('./app/routes/sign.routes')(app);
require('./app/routes/nft.routes')(app);
require('./app/routes/admin.routes')(app);

app.get('/file/profile/:filename', async (req, res) => {
  const filename = req.params.filename;

  res.sendFile(path.join(__dirname, './app/upload/profile/' + filename));
})

async function checkSuperAdmin() {
  try {
    await db.sequelize.sync();
    const Admin = db.admin;
    let superAdmin = await Admin.findOne({
      where: {
        role: 'SUPER_ADMIN'
      }
    });
    if (!superAdmin) {
      const defaultPassword = 'superadmin123!@#'
      const hash = await bcrypt.hash(defaultPassword, 12);
      await Admin.create({
        email: 'superadmin@gmail.com',
        password: hash,
        role: 'SUPER_ADMIN',
        status: 1
      });
      console.log('=======================');
      console.log("SUPER ADMIN account created successfully.");
      console.log('=======================');
    }
  } catch (err) {
    console.log(err);
  }
}

checkSuperAdmin();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
