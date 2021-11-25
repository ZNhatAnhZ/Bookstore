const users = require('../models/users');
const bcrypt = require('bcrypt');

function renderRegister(req, res) {
    if (req.query.origin)
        req.session.returnTo = req.query.origin
    else
        req.session.returnTo = req.header('Referer')
    res.render('register.ejs');
}

async function Register(req, res) {
    let returnTo = '/';
    const { password, username } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = await users.findOne({
        where: {
            user_name: username
        }
    });
    if (user == null) {
        const newUser = await users.create({
            user_name: username,
            user_type: 'user',
            password: hash
        })
        req.session.user_id = newUser.dataValues.id;
        if (req.session.returnTo) {
            returnTo = req.session.returnTo
            delete req.session.returnTo
        }
        if (returnTo.includes('register')) {
            res.redirect('/');
        } else {
            res.redirect(returnTo);
        }
    } else {
        let wrong = 'already existed user';
        res.send({ wrong });
    }
}

module.exports = {
    renderRegister,
    Register
}
