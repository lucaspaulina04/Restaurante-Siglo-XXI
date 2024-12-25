const mongoose = require('mongoose');

const RecetaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    ingredientes: [
        {
            nombre: { type: String, required: true },
            cantidad: { type: Number, required: true },
            unidadMedida: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model('Receta', RecetaSchema);
