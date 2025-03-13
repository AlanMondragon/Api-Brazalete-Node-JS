const Bracelet = require('../models/Bracelet');

// Crear una pulsera
exports.createBracelet = async (req, res) => {
    try {
          const bracelet = new Bracelet(req.body)
          bracelet.edo = true;
          await bracelet.save();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las pulseras
exports.getBracelets = async (req, res) => {
    try {
        const bracelets = await Bracelet.find({
            edo : true
        });
        res.status(200).json(bracelets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una pulsera por ID
exports.getBraceletById = async (req, res) => {
    try {
        const bracelet = await Bracelet.findById(req.params.id);
        if (!bracelet) {
            return res.status(404).json({ error: 'Pulsera no encontrada' });
        }
        res.status(200).json(bracelet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar una pulsera por ID
exports.updateBracelet = async (req, res) => {
    try {
        const bracelet = await Bracelet.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Devuelve el documento actualizado
            runValidators: true // Aplica las validaciones del esquema
        });
        if (!bracelet) {
            return res.status(404).json({ error: 'Pulsera no encontrada' });
        }
        res.status(200).json(bracelet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Desactivar una pulsera por ID
exports.deactivateBracelet = async (req, res) => {
    try {
        const result = await Bracelet.updateOne(
            { _id: req.params.id },
            { edo: false }
        );
        // Verificar si se actualizó algún documento
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Pulsera no encontrada' });
        }
        res.status(200).json({ message: 'Pulsera desactivada correctamente' });
    } catch (error) {
        // Manejar errores
        res.status(500).json({ error: error.message });
    }
};