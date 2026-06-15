const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const Produs = require('../models/Produs');
const Animal = require('../models/Animal');
const Vizita = require('../models/Vizita');
const Comanda = require('../models/Comanda');

router.use(requireAdmin);

// Dashboard
router.get('/', async (req, res) => {
    const produse = await Produs.find({});
    const animale = await Animal.find({});
    const vizite = await Vizita.find({}).sort({ createdAt: -1 });
    const comenzi = await Comanda.find({}).sort({ createdAt: -1 });
    res.render('admin/index', { produse, animale, vizite, comenzi });
});

// === PRODUSE ===
router.get('/produse/adauga', (req, res) => {
    res.render('admin/produs-form', { produs: null, eroare: null });
});

router.post('/produse/adauga', async (req, res) => {
    try {
        const { nume, pret, stoc, descriere } = req.body;
        await new Produs({ nume, pret: Number(pret), stoc: Number(stoc), descriere }).save();
        res.redirect('/admin');
    } catch (err) {
        res.render('admin/produs-form', { produs: null, eroare: 'Eroare la salvare.' });
    }
});

router.get('/produse/editeaza/:id', async (req, res) => {
    try {
        const produs = await Produs.findById(req.params.id);
        if (!produs) return res.redirect('/admin');
        res.render('admin/produs-form', { produs, eroare: null });
    } catch (err) {
        res.redirect('/admin');
    }
});

router.post('/produse/editeaza/:id', async (req, res) => {
    try {
        const { nume, pret, stoc, descriere } = req.body;
        await Produs.findByIdAndUpdate(req.params.id, {
            nume, pret: Number(pret), stoc: Number(stoc), descriere
        });
        res.redirect('/admin');
    } catch (err) {
        const produs = await Produs.findById(req.params.id);
        res.render('admin/produs-form', { produs, eroare: 'Eroare la salvare.' });
    }
});

router.get('/produse/sterge/:id', async (req, res) => {
    try {
        await Produs.findByIdAndDelete(req.params.id);
    } catch (err) {}
    res.redirect('/admin');
});

// === ANIMALE ===
router.get('/animale/adauga', (req, res) => {
    res.render('admin/animal-form', { animal: null, eroare: null });
});

router.post('/animale/adauga', async (req, res) => {
    try {
        const { nume, specie, varsta, descriere, emoji } = req.body;
        await new Animal({ nume, specie, varsta: Number(varsta), descriere, emoji }).save();
        res.redirect('/admin');
    } catch (err) {
        res.render('admin/animal-form', { animal: null, eroare: 'Eroare la salvare.' });
    }
});

router.get('/animale/sterge/:id', async (req, res) => {
    try {
        await Animal.findByIdAndDelete(req.params.id);
    } catch (err) {}
    res.redirect('/admin');
});

module.exports = router;