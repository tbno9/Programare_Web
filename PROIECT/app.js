require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('CONECTAT CU SUCCES LA MONGODB ATLAS'))
    .catch(err => console.error('EROARE CONECTARE MONGO:', err));

// Importam rutele si middleware-urile
const logger = require('./middleware/logger');
const authRoutes = require('./routes/auth');
const magazinRoutes = require('./routes/magazin');
const adminRoutes = require('./routes/admin');
const fermaRoutes = require('./routes/ferma');
const cosRoutes = require('./routes/cos');

const app = express();

// Configurare View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware-uri obligatorii
app.use(express.static(path.join(__dirname, 'public'))); // Pentru CSS si imagini
app.use(express.urlencoded({ extended: true })); // Pentru a citi datele din formulare
app.use(cookieParser()); // Pentru cookie-uri proprii

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_ferma_boco_123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

app.use((req, res, next) => {
    res.locals.user = req.session.userId || null;
    res.locals.role = req.session.role || null;
    next();
});

app.use(logger);

// Definirea Rutelor
app.get('/', (req, res) => {
    res.render('acasa');
});

app.use('/', authRoutes);

app.use('/magazin', magazinRoutes);

app.use('/admin', adminRoutes);
app.use('/ferma', fermaRoutes);
app.use('/cos', cosRoutes);

// Pornire Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`================================0`);
    console.log(`FERMA BoCO RULEAZA PE PORTUL ${PORT}`);
    console.log(`Adresa: http://localhost:${PORT}`);
    console.log(`================================`);
});