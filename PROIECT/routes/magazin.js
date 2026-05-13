const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');

// 1. IMPORTĂ MODELUL PRODUS (Aceasta era linia care lipsea)
const Produs = require('../models/Produs'); 

// Cerința 3.1: Protejăm rutele
router.use(requireLogin);

// GET /magazin
router.get('/', async (req, res) => {
    try {
        req.session.views = (req.session.views || 0) + 1;

        // 2. Așteaptă datele din MongoDB
        const produseDinDB = await Produs.find({});

        res.render('magazin/index', {
            user: req.session.userId,
            produse: produseDinDB, // Trimitem produsele din baza de date
            views: req.session.views,
            ultimaVizita: req.cookies.ultima_vizita || null
        });
    } catch (err) {
        console.error("Eroare la încărcarea magazinului:", err);
        res.status(500).send("Eroare server");
    }
});

module.exports = router;