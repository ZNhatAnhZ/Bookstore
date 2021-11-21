function isLoggedin(req, res, next) {
    if (!req.session.user_id) {
        res.redirect(`/login?origin=${req.originalUrl}`);
    }
    next();
}

module.exports = {
    isLoggedin
}