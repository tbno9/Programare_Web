module.exports = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next(); //e logat utiliz. poate naviga mai departe
    } else {
        res.redirect('/login'); //nu e logat
    }
};