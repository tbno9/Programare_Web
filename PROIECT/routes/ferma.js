const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const Animal = require('../models/Animal');
const Vizita = require('../models/Vizita');

router.use(requireLogin);

router.get('/', async (req, res) => {
    const animale = await Animal.find({});
    res.render('ferma/index', { animale });
});

router.get('/vizita', (req, res) => {
    res.render('ferma/vizita-form', { eroare: null });
});

router.post('/vizita', async (req, res) => {
    try {
        const { data, ora, persoane, mesaj } = req.body;
        await new Vizita({
            userEmail: req.session.userId,
            data, ora,
            persoane: Number(persoane),
            mesaj
        }).save();
        res.render('ferma/vizita-confirmare', { data, ora, persoane });
    } catch (err) {
        res.render('ferma/vizita-form', { eroare: 'Eroare la programare.' });
    }
});

router.get('/vizitele-mele', async (req, res) => {
    const vizite = await Vizita.find({ userEmail: req.session.userId }).sort({ createdAt: -1 });
    res.render('ferma/vizitele-mele', { vizite });
});

module.exports = router;