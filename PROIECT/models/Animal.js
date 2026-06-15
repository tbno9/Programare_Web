const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    nume: { type: String, required: true }, // ex: "Bella"
    specie: { type: String, required: true }, // ex: "Vaca"
    varsta: { type: Number },
    descriere: { type: String },
});

module.exports = mongoose.model('Animal', animalSchema);