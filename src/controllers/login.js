const users = require('../models/users');
const bcrypt = require('bcrypt');

function renderLogin(req, res) {
    if (req.query.origin) {
        req.session.returnTo = req.query.origin;
    } else {
        req.session.returnTo = req.header('Referer');
    }
    res.render('login.ejs');
}

async function Login(req, res) {
    let returnTo = '/';
    const { password, username } = req.body;
    const user = await users.findOne({
        where: {
            user_name: username
        }
    });
    if (user != null) {
        const validPassword = await bcrypt.compare(password, user.dataValues.password);
        if (validPassword) {
            req.session.user_id = user.dataValues.id;
            if (req.session.returnTo) {
                returnTo = req.session.returnTo
                delete req.session.returnTo
            }
            if (returnTo.includes('login')) {
                res.redirect('/');
            } else {
                res.redirect(returnTo);
            }
        } else {
            let wrong = 'password';
            res.send({ wrong });
        }
    } else {
        let wrong = 'username';
        res.send({ wrong });
    }
}

module.exports = {
    renderLogin,
    Login
}
