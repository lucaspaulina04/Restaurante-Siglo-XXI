const Receta = require('../models/Receta');

exports.obtenerRecetas = async (req, res) => {
    try {
        const recetas = await Receta.find();
        res.json(recetas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.crearReceta = async (req, res) => {
    const { nombre, ingredientes } = req.body;
    try {
        const nuevaReceta = new Receta({ nombre, ingredientes });
        await nuevaReceta.save();
        res.status(201).json(nuevaReceta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
