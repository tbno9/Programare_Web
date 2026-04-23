require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

// Importăm rutele și middleware-urile noastre
const logger = require('./middleware/logger');
const authRoutes = require('./routes/auth');
const magazinRoutes = require('./routes/magazin');

const app = express();

// 1. Configurare View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Middleware-uri obligatorii
app.use(express.static(path.join(__dirname, 'public'))); // Pentru CSS și imagini
app.use(express.urlencoded({ extended: true }));       // Pentru a citi datele din formulare
app.use(cookieParser());                               // Pentru cookie-uri proprii

// 3. Configurare Sesiuni (Cerința 2.2)
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_ferma_boco_123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // Sesiunea expiră după 1 oră
}));

// 4. Middleware-ul tău propriu de Logging (Cerința 2.4)
app.use(logger);

// 5. Definirea Rutelor
// Pagina principală (publică)
app.get('/', (req, res) => {
    res.render('acasa'); // Va randa views/acasa.ejs
});

// Rutele pentru Login, Register, Logout
app.use('/', authRoutes);

// Rutele pentru zona protejată a Magazinului
app.use('/magazin', magazinRoutes);

// 6. Pornire Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`================================0`);
    console.log(`FERMA BoCO RULEAZĂ PE PORTUL ${PORT}`);
    console.log(`Adresă: http://localhost:${PORT}`);
    console.log(`================================`);
});