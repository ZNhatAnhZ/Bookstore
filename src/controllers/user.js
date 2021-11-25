const users = require('../models/users');
const bcrypt = require('bcrypt');

async function findUser(req, res) {
    if (req.query['id'] != null) {
        const User = await users.findByPk(req.query.id);
        res.send(User);
    } else if (req.session.user_id) {
        const user_id = req.session.user_id
        res.send({ user_id });
    } else {
        // const Users = await users.findAll();
        // const data = JSON.stringify(Users, null, 2)
        // res.send(data);
        res.send({})
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
        // res.send('unable to connect');
    }
}

async function changePassword(req, res) {
    let { id } = req.params;
    if (req.session.user_id && id == req.session.user_id) {
        let { password, newpassword } = req.body;
        const user = await users.findOne({
            where: {
                id: req.session.user_id
            }
        });

        if (user != null) {
            const validPassword = await bcrypt.compare(password, user.dataValues.password);
            const hash = await bcrypt.hash(newpassword, 12);
            if (validPassword) {
                await user.update({
                    password: hash
                }, {
                    where: {
                        id: req.session.user_id
                    }
                });
                let isSucceed = true;
                res.send({ isSucceed });
            } else {
                let isSucceed = false;
                res.send({ isSucceed });
            }
        } else {
            let isSucceed = false;
            res.send({ isSucceed });
        }
        // username = user.dataValues.user_name;
        // res.render('user-info.ejs', { username });
        // res.end();
    } else {
        // res.send('unable to connect');
    }
}

module.exports = {
    findUser,
    renderUser,
    changePassword
}