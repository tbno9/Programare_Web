const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin'); // Verifică dacă ai și acest folder/fișier!
const produse = require('../db/produse'); // Verifică dacă ai folderul db și fișierul produse.js

// Cerința 3.1: Protejăm rutele cu middleware-ul de autentificare [cite: 31]
router.use(requireLogin);

// GET /magazin [cite: 21]
router.get('/', (req, res) => {
    // Cerința 2.3: Trimitem datele către EJS [cite: 23, 26]
    req.session.views = (req.session.views || 0) + 1;
    res.render('magazin/index', {
        user: req.session.userId,
        produse: produse,
        vizite: req.session.views,
        ultimaVizita: req.cookies.ultima_vizita || null
    });
});

module.exports = router;