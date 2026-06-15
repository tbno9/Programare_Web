const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const Produs = require('../models/Produs'); 

router.use(requireLogin);

// GET /magazin
router.get('/', async (req, res) => {
    try {
        req.session.views = (req.session.views || 0) + 1;
        const produseDinDB = await Produs.find({});
        res.render('magazin/index', {
            produse: produseDinDB,
            views: req.session.views,
            ultimaVizita: req.cookies.ultima_vizita || null
        });
    } catch (err) {
        res.status(500).send("Eroare server");
    }
});

module.exports = router;