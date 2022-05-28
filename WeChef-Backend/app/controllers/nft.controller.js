const db = require("../models");
const Collection = db.collection;
const Item = db.item
const User = db.user;
const History = db.history;
const List = db.list;
const ReportHistory = db.report;
const fs = require('fs');
const path = require('path');

exports.createCollection = async (req, res) => {
  try {
    const user = await User.findByPk(req.body.creator);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    // if (!user.allowed) {
    //   return res.status(400).json({ message: 'You are not allowed to create a collection' });
    // }

    let collection = await Collection.findOne({
      where: {
        id: req.body.collection_id
      },
      include: ["user"]
    });

    if (collection) {
      collection.name = req.body.name;
      collection.creator = req.user.id;
      collection.total_items = req.body.total_items;
      collection.total_owners = req.body.total_owners;
      collection.floor_price = req.body.floor_price;
      collection.description = req.body.description;
      await collection.save();

    } else {

      collection = await Collection.create({
        name: req.body.name,
        creator: req.user.id,
        total_items: req.body.total_items,
        total_owners: req.body.total_owners,
        floor_price: req.body.floor_price,
        description: req.body.description
      })

    }
    const newpath = path.join(__dirname, `../upload/collection`);
    if (!fs.existsSync(newpath)) {
      console.log(newpath)
      fs.mkdir(newpath, { recursive: true }, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log("Collection directory successfully created.")
        }
      })
    }
    const allowedExtension = ['.png', '.jpg', '.jpeg'];

    if (req.files) {
      const logo_file = req.files.logo_image;
      const banner_file = req.files.banner_image;

      if (logo_file) {
        let extension = path.extname(logo_file.name);
        if (!allowedExtension.includes(extension)) {
          return res.status(422).send("Invalid Image");
        }
        let logo_filename = '';
        logo_filename = req.user.address + `_${collection.id}` + `_logo${extension}`;
        collection.logo_img = logo_filename;
        await logo_file.mv(`${newpath}/${logo_filename}`);
      }

      if (banner_file) {
        let extension = path.extname(banner_file.name);
        if (!allowedExtension.includes(extension)) {
          return res.status(422).send("Invalid Image");
        }
        let banner_filename = '';
        banner_filename = req.user.address + `_${collection.id}` + `_banner${extension}`;
        collection.banner_img = banner_filename;
        await banner_file.mv(`${newpath}/${banner_filename}`);
      }
    }

    await collection.save();
    return res.json(collection);
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.getMyCollection = async (req, res) => {
  try {
    let collection = await Collection.findAll({
      where: {
        creator: req.user.id
      },
      include: [{ model: User, as: 'user' }]
    });
    res.json(collection);
    return;
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.getCollections = async (req, res) => {
  try {
    let collections = await Collection.findAll({
      include: [{ model: User, as: 'user' }]
    });

    return res.json(collections);
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.getCollectionDetail = async (req, res) => {
  try {
    let collection = await Collection.findByPk(req.params.id);
    const query1 = 'select count(a.*) as cnt from (' +
      'select owner from items where collection_id = 1 group by owner' +
      ') a';
    const result1 = await db.sequelize.query(query1, {
      replacements: { collection_id: req.params.id }
    })
    const query2 = 'select * from (' +
      'select b.collection_id, min(a.price) as floor_price from histories a, items b where a.event = \'Sold\' and a.token_id = b."tokenId" group by b.collection_id' +
      ') tb where tb.collection_id = :collection_id';
    const result2 = await db.sequelize.query(query2, {
      replacements: { collection_id: req.params.id }
    })
    return res.json({ collection, result1, result2 });
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    let item = await Item.findOne({
      where: {
        id: req.body.id
      }
    });

    if (item) {
      item.name = req.body.name;
      item.creator = req.user.id;
      item.owner = req.user.id;
      item.collection_id = req.body.collection;
      item.externalLink = req.body.externalLink;
      item.description = req.body.description;
      item.properties = JSON.parse(req.body.properties);
      item.unlockable = req.body.unlockable;
      item.unlockableContent = req.body.unlockableContent;
      item.supply = req.body.supply;
      item.asset = req.body.asset;
      item.asset_filetype = req.body.asset_filetype;
      item.tokenId = req.body.tokenId;
      item.ipfs_cid = req.body.ipfs_cid;

      await item.save();

    } else {

      let collection = await Collection.findByPk(req.body.collection);
      item = await Item.findAll({
        where: {
          collection_id: req.body.collection
        }
      });
      if (item.length >= collection.total_items) {
        return res.status(400).json({ message: 'Total Items exceed!' });
      }
      item = await Item.create({
        name: req.body.name,
        creator: req.user.id,
        owner: req.user.id,
        collection_id: req.body.collection,
        externalLink: req.body.externalLink,
        description: req.body.description,
        properties: JSON.parse(req.body.properties),
        unlockable: req.body.unlockable,
        unlockableContent: req.body.unlockableContent,
        supply: req.body.supply,
        asset: req.body.asset,
        asset_filetype: req.body.asset_filetype,
        tokenId: req.body.tokenId,
        ipfs_cid: req.body.ipfs_cid
      })

      await History.create({
        event: 'Mint',
        user_id: req.user.id,
        from: '0x0000000000000000000000000000000000000000',
        to: req.user.address,
        price: 0,
        token_id: req.body.tokenId
      })
    }

    const newpath = path.join(__dirname, `../upload/item`);
    if (!fs.existsSync(newpath)) {
      fs.mkdir(newpath, { recursive: true }, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log("Upload directory successfully created.")
        }
      })
    }
    const allowedExtension = ['.png', '.jpg', '.jpeg'];
    if (req.files) {
      const preview_file = req.files.preview_image;
      let extension = path.extname(preview_file.name);
      if (!allowedExtension.includes(extension)) {
        return res.status(422).send("Invalid Image");
      }
      let filename = '';
      filename = req.user.address + `_${item.id}` + `_preview${extension}`;
      item.preview_img = filename;
      await preview_file.mv(`${newpath}/${filename}`);
      await item.save();
    }
    return res.json(item);
  }
  catch (err) {
    console.log(err)
    return res.status(500).send({ message: err.message });
  }
}

exports.changeItemOwner = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        wallet: req.body.owner
      }
    });

    if (user) {
      const query = "update items set owner=:owner where id=:id";
      const result = await db.sequelize.query(query, {
        replacements: { owner: user.id, id: req.body.id }
      });

      return res.json({ success: true });
    }
    return res.status(400).json({ message: 'User not found' });
  } catch (err) {
    console.log(err)
    return res.status(500).json(err.message)
  }
}

exports.checkCreateItem = async (req, res) => {
  try {
    let collection = await Collection.findByPk(req.body.collection);
    let item = await Item.findAll({
      where: {
        collection_id: req.body.collection
      }
    });
    if (item.length >= collection.total_items) {
      return res.status(400).json({ message: 'Total Items exceed!' });
    }
    return res.json({ message: 'You can create new item' });
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

exports.getItem = async (req, res) => {
  try {
    const query = 'select tb1.*, COALESCE(tb2.max_sold_price, 0) as max_sold_price, COALESCE(tb2.latest_sold_date, \'0001-01-01\') as latest_sold_date, users.username, users.wallet, users.profile_img, ' +
      'collections.name as collection_name, collections.creator as collection_creator, collections.total_items, collections.total_owners, collections.floor_price, collections.logo_img, collections.banner_img, collections.description ' +
      'from(' +
      'select a.*, COALESCE(b.price, 0) as listed_price, COALESCE(b."createdAt", \'0001-01-01\') as listed_date from items a left join(' +
      'select * from lists where status = 0' +
      ') b on a."tokenId" = b."tokenId"' +
      ') tb1 left join(' +
      'select c.*, d.id from(' +
      'select token_id, max(price) as max_sold_price, max("createdAt") as latest_sold_date from histories where event = \'Sold\' group by token_id' +
      ') c, items d where c.token_id = d."tokenId"' +
      ') tb2 on tb1.id = tb2.id ' +
      'left join users on users.id = tb1.owner ' +
      'left join collections on collections.id = tb1.collection_id ' +
      'where tb1.blocked = false and tb1.collection_id = :collection_id';
    const result = await db.sequelize.query(query, {
      replacements: { collection_id: req.query.collection }
    })

    return res.json(result);
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }
}

exports.getItemDetail = async (req, res) => {
  try {
    let item = await Item.findOne({
      where: {
        id: req.params.id
      },
      include: [{ model: User, as: 'user' }, { model: Collection, as: 'collection' }]
    });

    let histories = await History.findAll({
      where: {
        token_id: item.tokenId
      },
      include: [{ model: User, as: 'user' }],
      order: [
        ['createdAt', 'DESC']
      ]
    });

    let lists = await List.findAll({
      where: {
        tokenId: item.tokenId
      },
      include: [{ model: User, as: 'user' }]
    });

    let reportHistory = await ReportHistory.findAll({
      where: {
        report_item: item.id
      },
      include: [{ model: User, as: 'user' }]
    });
    return res.json({ item, histories, lists, reportHistory });
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }
}

exports.createHistory = async (req, res) => {
  try {
    let history = await History.create({
      event: req.body.event,
      user_id: req.user.id,
      from: req.body.from,
      to: req.body.to,
      price: req.body.price,
      token_id: req.body.tokenId
    })
    return res.json(history);
  }
  catch (err) {

    return res.status(500).send({ message: err.message });
  }
}

exports.getHistory = async (req, res) => {
  try {
    let histories = await History.findAll({
      where: {
        tokenId: req.query.tokenId
      },
      include: [{ model: User, as: 'user' }]
    });
    return res.json(histories);
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }
}

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

exports.getAllHistory = async (req, res) => {
  try {
    const { page, rowsPerPage } = req.query;
    const { limit, offset } = getPagination(page, rowsPerPage);

    const query1 = 'select a.*, b.name as item_name, b.preview_img, c.name as collection_name ' +
      'from histories a, items b, collections c ' +
      'where a.token_id = b."tokenId" and b.collection_id = c.id ' +
      'order by a."createdAt" desc limit :limit offset :offset';
    const result1 = await db.sequelize.query(query1, {
      replacements: { limit: limit, offset: offset }
    });
    const query2 = 'select count(*) as cnt from histories';
    const result2 = await db.sequelize.query(query2);
    return res.json({ result1, result2 });
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }
}

exports.createList = async (req, res) => {
  try {
    let list = await List.create({
      user_id: req.user.id,
      tokenId: req.body.tokenId,
      price: req.body.price,
      from: req.body.from,
      to: req.body.to,
      reservedAddress: req.body.reservedAddress
    })
    return res.json(list);
  }
  catch (err) {

    return res.status(500).send({ message: err.message });
  }

}

exports.getList = async (req, res) => {
  try {
    let lists = await List.findAll({
      where: {
        tokenId: req.query.tokenId
      },
      include: [{ model: User, as: 'user' }]
    });
    return res.json(lists);
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }
}

exports.insertBuyHistory = async (req, res) => {
  try {
    const history1 = await History.create({
      event: 'Sold',
      user_id: req.user.id,
      from: req.body.seller,
      to: req.body.buyer,
      price: req.body.price,
      token_id: req.body.tokenId
    })
    const history2 = await History.create({
      event: 'Transfer',
      user_id: req.user.id,
      from: req.body.seller,
      to: req.body.buyer,
      price: 0,
      token_id: req.body.tokenId
    })
    return res.json([history1, history2]);
  } catch (err) {
    return res.status(500).json(err);
  }
}

exports.insertListHistory = async (req, res) => {
  try {
    const history = await History.create({
      event: 'List',
      user_id: req.user.id,
      from: req.body.user,
      to: "0x0000000000000000000000000000000000000000",
      price: req.body.price,
      token_id: req.body.tokenId
    })
    const list = await List.create({
      user_id: req.user.id,
      tokenId: req.body.tokenId,
      price: req.body.price,
      from: req.body.from,
      to: req.body.to,
      reservedAddress: req.body.reservedAddress
    })
    return res.json({ history: history, list: list })
  } catch (err) {
    return res.status(500).json(err)
  }
}

exports.getPopularItems = async (req, res) => {
  try {
    const query1 = 'select tb4.*, tb5.username as owner_name, tb5.wallet, tb5.profile_img from (' +
      'select tb1.*, tb2.cnt as cnt, tb3.name as collection_name from(' +
      'select a.*, b.latest_sold_price, c.listed_price from items a left join(' +
      'select a.token_id, a.price as latest_sold_price from histories a, (' +
      'select token_id, max("createdAt") as latest_sold_date from histories where event = \'Sold\' group by token_id' +
      ') b where a.token_id = b.token_id and a."createdAt" = b.latest_sold_date' +
      ') b on a."tokenId" = b.token_id ' +
      'left join(' +
      'select a.id, a."tokenId", COALESCE(b.price, 0) as listed_price, b."createdAt" as listed_date from items a left join(' +
      'select * from lists where status = 0' +
      ') b on a."tokenId" = b."tokenId"' +
      ') c on a."tokenId" = c."tokenId"' +
      ') tb1, (' +
      'select token_id, count(*) as cnt from histories where event = \'Sold\' group by token_id' +
      ') tb2, collections tb3 where tb1."collection_id" = tb3.id and tb1."tokenId" = tb2.token_id' +
      ') tb4, users tb5 where tb4.owner = tb5.id and tb4.blocked = false order by tb4.cnt desc limit 12 offset 0';
    const popular_items = await db.sequelize.query(query1)

    const query2 = 'select * from users a, (' +
      'select user_id, sum(price) as total_money, min(price) as floor_price from histories where event = \'Sold\' group by user_id' +
      ') b where a.id = b.user_id order by b.total_money desc limit 12 offset 0';
    const top_sellers = await db.sequelize.query(query2)

    return res.json({ popular_items, top_sellers });
  } catch (err) {
    return res.status(500).json(err)
  }
}

exports.getAllItems = async (req, res) => {
  try {
    const { page, rowsPerPage } = req.body;

    const query = 'select tb3.*, tb4.listed_price, COALESCE(tb4.listed_date, \'0001-01-01\') as listed_date, ' +
      'COALESCE(tb5.max_sold_price, 0) as max_sold_price, COALESCE(tb5.min_sold_price, 0) as min_sold_price, COALESCE(tb5.latest_sold_date, \'0001-01-01\') as latest_sold_date, COALESCE(tb6.latest_sold_price, 0) as latest_sold_price ' +
      'from(' +
      'select tb1.*, tb2.username as owner_name, tb2.profile_img as profile_img, tb2.wallet as wallet from (' +
      'select a.*, b.name as collection_name, c.username as creator_name ' +
      'from items a, collections b, users c ' +
      'where a.collection_id = b.id and a.creator = c.id' +
      ') tb1, users tb2 ' +
      'where tb1.owner = tb2.id' +
      ') tb3 left join(' +
      'select a.id, COALESCE(b.price, 0) as listed_price, b."createdAt" as listed_date from items a left join(' +
      'select * from lists where status = 0' +
      ') b on a."tokenId" = b."tokenId"' +
      ') tb4 on tb3.id = tb4.id ' +
      'left join(' +
      'select c.*, d.id from(' +
      'select token_id, max(price) as max_sold_price, min(price) as min_sold_price, max("createdAt") as latest_sold_date from histories where event = \'Sold\' group by token_id' +
      ') c, items d where c.token_id = d."tokenId"' +
      ') tb5 on tb3.id = tb5.id ' +
      'left join (' +
      'select a.id, a.price as latest_sold_price from histories a, (' +
      'select token_id, max("createdAt") as latest_sold_date from histories where event = \'Sold\' group by token_id' +
      ') b where a.token_id = b.token_id and a."createdAt" = b.latest_sold_date' +
      ') tb6 on tb3.id = tb6.id where tb3.blocked = false limit :page offset :offset';
    const result = await db.sequelize.query(query, {
      replacements: { page: rowsPerPage, offset: page * rowsPerPage }
    });

    let itemCount = await Item.count();

    return res.json({ result, itemCount });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

exports.getMyItems = async (req, res) => {
  try {
    const { page, rowsPerPage, account } = req.body;

    const user = await User.findOne({
      where: {
        wallet: account
      }
    })
    if (user) {
      const uid = user.id;

      const query = 'select tb3.*, tb4.listed_price, COALESCE(tb4.listed_date, \'0001-01-01\') as listed_date, ' +
        'COALESCE(tb5.max_sold_price, 0) as max_sold_price, COALESCE(tb5.min_sold_price, 0) as min_sold_price, COALESCE(tb5.latest_sold_date, \'0001-01-01\') as latest_sold_date, COALESCE(tb6.latest_sold_price, 0) as latest_sold_price ' +
        'from(' +
        'select tb1.*, tb2.username as owner_name, tb2.profile_img as profile_img, tb2.wallet as wallet from (' +
        'select a.*, b.name as collection_name, c.username as creator_name ' +
        'from items a, collections b, users c ' +
        'where a.collection_id = b.id and a.creator = c.id and a.owner = :account' +
        ') tb1, users tb2 ' +
        'where tb1.owner = tb2.id' +
        ') tb3 left join(' +
        'select a.id, COALESCE(b.price, 0) as listed_price, b."createdAt" as listed_date from items a left join(' +
        'select * from lists where status = 0' +
        ') b on a."tokenId" = b."tokenId"' +
        ') tb4 on tb3.id = tb4.id ' +
        'left join(' +
        'select c.*, d.id from(' +
        'select token_id, max(price) as max_sold_price, min(price) as min_sold_price, max("createdAt") as latest_sold_date from histories where event = \'Sold\' group by token_id' +
        ') c, items d where c.token_id = d."tokenId"' +
        ') tb5 on tb3.id = tb5.id ' +
        'left join (' +
        'select a.token_id, a.price as latest_sold_price from histories a, (' +
        'select token_id, max("createdAt") as latest_sold_date from histories where event = \'Sold\' group by token_id' +
        ') b where a.token_id = b.token_id and a."createdAt" = b.latest_sold_date' +
        ') tb6 on tb3."tokenId" = tb6.token_id where tb3.blocked = false limit :page offset :offset';
      const result = await db.sequelize.query(query, {
        replacements: { page: rowsPerPage, offset: page * rowsPerPage, account: uid }
      });

      const query2 = 'select count(*) as cnt from items where owner = :account';
      let itemCount = await db.sequelize.query(query2, {
        replacements: { account: uid }
      })

      return res.json({ result, itemCount });
    }
    return res.status(400).json({ message: 'User not found' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

exports.updateListHistory = async (req, res) => {
  try {
    const query = 'UPDATE lists SET "status" = 1 where "tokenId" = :tokenId and status = 0';
    await db.sequelize.query(query, {
      replacements: { tokenId: req.body.tokenId }
    });
    return res.json({ message: 'success' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

exports.checkState = async (req, res) => {
  try {
    const user = await User.findOne({ where: { wallet: req.body.account } });
    if (user) {
      return res.json(user.allowed);
    }
    return res.status(400).json({ message: 'User not found' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

exports.checkItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);
    return res.json(item.blocked);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

exports.reportItem = async (req, res) => {
  try {
    const { itemId, reporter, reason } = req.body;
    var item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(400).json({ message: 'Item does not exist' });
    }

    var report_user = await db.sequelize.query('select * from users where wallet = :walletAddress', {
      replacements: { walletAddress: reporter }
    });

    var reportHistory = await ReportHistory.findOne({ where: { report_item: itemId, report_user: report_user[0][0].id } });
    if (reportHistory) {
      reportHistory.reason = reason;
      reportHistory.report_user = report_user[0][0].id;
      await reportHistory.save();
    } else {
      await ReportHistory.create({
        report_user: report_user[0][0].id,
        report_item: itemId,
        reason: reason
      });
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}