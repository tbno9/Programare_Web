const mongoose = require('mongoose');

const comandaSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    produse: [
        {
            produsId: String,
            nume: String,
            pret: Number,
            cantitate: Number
        }
    ],
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comanda', comandaSchema);