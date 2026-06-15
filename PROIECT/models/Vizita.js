const mongoose = require('mongoose');

const vizitaSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    data: { type: String, required: true }, // format YYYY-MM-DD
    ora: { type: String, required: true },
    persoane: { type: Number, default: 1 },
    mesaj: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vizita', vizitaSchema);