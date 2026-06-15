const express = require('express');
const router = express.Router();
// const users = require('../db/users');
const bcrypt = require('bcrypt');
const User = require('../models/User');

//get login--------afisare formularul de logare 
router.get('/login', (req, res) => res.render('login'));

// post login-----proceseaza logarea
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.email;
        req.session.role = user.role;
        const acum = new Date().toLocaleTimeString('ro-RO');
        res.cookie('ultima_vizita', acum, { maxAge: 900000 });
        if (user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/magazin');
        }
    } else {
        res.render('login', { eroare: 'Email sau parolă greșită!' });
    }
});

// GET /register - Formular
router.get('/register', (req, res) => res.render('register'));

// POST /register ----- salvare user
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            role: 'user'
        });
        
        await newUser.save();
        
        req.session.userId = req.body.email;
        req.session.role = "user";
        res.redirect('/magazin');
    } catch (err) {
        res.render('register', { eroare: 'Eroare la înregistrare (posibil email duplicat).' });
    }
});

// GET /logout-----inchidere sesiune 
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;