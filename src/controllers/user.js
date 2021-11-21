const users = require('../models/users');

async function findUser(req, res) {
    if (req.query['id'] != null) {
        const User = await users.findByPk(req.query.id);
        res.send(User);
    } else {
        const Users = await users.findAll();
        const data = JSON.stringify(Users, null, 2)
        res.send(data);
    }
}

async function renderUser(req, res) {
    let username = null;
    let { id } = req.params;
    if (req.session.user_id && id == req.session.user_id) {
        loginCheck = req.session.user_id;
        const user = await users.findOne({
            where: {
                id: req.session.user_id
            },
            attributes: ['user_name']
        });
        username = user.dataValues.user_name;
        res.render('user-info.ejs', { username });
        res.end();
    } else {
        res.send('unable to connect');
    }
}

module.exports = {
    findUser,
    renderUser
}