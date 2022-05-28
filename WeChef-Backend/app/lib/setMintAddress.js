const db = require("../models");
const User = db.user;

exports.setmintAddress = async () => {
    try {

        let user = await User.findOne({
            where: {
                wallet: '0x0000000000000000000000000000000000000000'
            }
        });

        if (!user) {
            await User.create({
                username: 'NullAddress',
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