const express = require('express');
const router = express.Router();
const users = require('../db/users');
const bcrypt = require('bcrypt'); // Pentru bonusul de 0.5p [cite: 17]

//get login--------afisare formularul de logare 
router.get('/login', (req, res) => res.render('login'));

// post login-----proceseaza logarea
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.email;
        res.cookie('fermier_activ', 'da', { maxAge: 900000 });
        res.redirect('/magazin');
    } else {
        res.render('login', { eroare: 'Email sau parolă greșită!' });
    }
});

// GET /register - Formular
router.get('/register', (req, res) => res.render('register'));

// POST /register ----- salvare user
router.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({ email: req.body.email, password: hashedPassword });
    req.session.userId = req.body.email;
    res.redirect('/magazin');
});

// GET /logout-----inchidere sesiune 
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;