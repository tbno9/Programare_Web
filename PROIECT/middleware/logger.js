module.exports = (req, res, next) => {
    const user = req.session.userId || "anonim";
    console.log(`${req.method} ${req.url} user: ${user}`);
    next();
};