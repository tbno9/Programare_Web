const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const Produs = require('../models/Produs');
const Comanda = require('../models/Comanda');

router.use(requireLogin);

// Vizualizare cos
router.get('/', async (req, res) => {
    const cos = req.session.cos || [];
    const items = await Promise.all(cos.map(async item => {
        const p = await Produs.findById(item.produsId);
        return p ? { ...item, nume: p.nume, pret: p.pret } : null;
    }));
    const total = items.reduce((sum, i) => i ? sum + i.pret * i.cantitate : sum, 0);
    res.render('cos/index', { items: items.filter(Boolean), total });
});

// Adauga in cos
router.post('/adauga', async (req, res) => {
    const { produsId, cantitate } = req.body;
    const cant = parseInt(cantitate) || 1;

    const produs = await Produs.findById(produsId);
    if (!produs || produs.stoc < cant) {
        return res.redirect('/magazin?eroare=stoc');
    }

    if (!req.session.cos) req.session.cos = [];

    const existent = req.session.cos.find(i => i.produsId === produsId);
    if (existent) {
        existent.cantitate += cant;
    } else {
        req.session.cos.push({ produsId, cantitate: cant });
    }

    res.redirect('/cos');
});

// Finalizare comanda
router.post('/finalizeaza', async (req, res) => {
    const cos = req.session.cos || [];
    try {
        // populate cu date din db
        const items = await Promise.all(cos.map(async item => {
            const p = await Produs.findById(item.produsId);
            return p ? { produsId: item.produsId, nume: p.nume, pret: p.pret, cantitate: item.cantitate } : null;
        }));
        const itemsFiltrate = items.filter(Boolean);
        const total = itemsFiltrate.reduce((sum, i) => sum + i.pret * i.cantitate, 0);

        // scade stocul
        for (const item of itemsFiltrate) {
            await Produs.findByIdAndUpdate(item.produsId, {
                $inc: { stoc: -item.cantitate }
            });
        }

        // salveaza comanda
        await new Comanda({
            userEmail: req.session.userId,
            produse: itemsFiltrate,
            total
        }).save();

        req.session.cos = [];
        res.render('cos/confirmare', {});
    } catch (err) {
        res.redirect('/cos');
    }
});

// Golire cos
router.get('/goleste', (req, res) => {
    req.session.cos = [];
    res.redirect('/cos');
});

module.exports = router;