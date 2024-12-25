const Bodega = require('../models/Bodega');

exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Bodega.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.agregarProducto = async (req, res) => {
    const { nombre, cantidad, unidadMedida } = req.body;
    try {
        const nuevoProducto = new Bodega({ nombre, cantidad, unidadMedida });
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, cantidad, unidadMedida } = req.body;
    try {
        const productoActualizado = await Bodega.findByIdAndUpdate(
            id,
            { nombre, cantidad, unidadMedida },
            { new: true }
        );
        res.json(productoActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        await Bodega.findByIdAndDelete(id);
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
