module.exports = (req, res, next) => {
    if (!req.session.userId || req.session.role !== 'admin') {
        return res.status(403).send('Acces interzis.');
    }
    next();
};