const mongoose = require('mongoose');

const produsSchema = new mongoose.Schema({
    nume: { type: String, required: true },
    pret: { type: Number, required: true },
    stoc: { type: String },
    descriere: { type: String }
});

module.exports = mongoose.model('Produs', produsSchema, 'produses');