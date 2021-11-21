const users = require('../models/users');

async function renderShop(req, res) {
    let username = null;
    let { id } = req.params;
    if (req.session.user_id != null && id == req.session.user_id) {
        loginCheck = req.session.user_id;
        const user = await users.findOne({
            where: {
                id: req.session.user_id
            },
            attributes: ['user_name']
        });
        username = user.dataValues.user_name;
        res.render('personalshop.ejs', { username, loginCheck });
        res.end();
    } else {
        // res.send('unable to connect');
    }
}

module.exports = {
    renderShop
}