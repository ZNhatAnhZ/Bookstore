function Logout(req, res) {
    req.session.destroy();
    res.redirect('/');
}

module.exports = {
    Logout
}
