const Bracelet = require('../models/Bracelet');
const dotenv = require("dotenv");
dotenv.config();

const MQTT_BROKER = process.env.MQTTIP;


exports.createBracelet = async (req, res) => {
    try {
        const exists = await Bracelet.exists({ _id: req.body._id });
        if (exists) {
            return res.status(400).json({ error: "Esta pulsera ya ha sido registrada" });
        }

        const bracelet = new Bracelet({
            _id: req.body._id,
            ...req.body,
            edo: true,
            ip_mqtt: MQTT_BROKER + "reminders/confirm/" + req.body._id
        });

        await bracelet.save();
        return res.status(200).json(bracelet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las pulseras
exports.getBracelets = async (req, res) => {
    try {
        const bracelets = await Bracelet.find({
            edo: true
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

//Obtener brazalete por id de usuario
exports.getBraceletByIdUser = async (req, res) => {
    try {
        const id_user = parseInt(req.params.id);
        const brazalet = await Bracelet.aggregate([
            {
                $match : {edo : true}
            },
            {
                $lookup: {
                    from: "users",
                    localField: "id_user",
                    foreignField: "_id",
                    as: "usuario"
                }
            },
            { $unwind: "$usuario" },
            {
                $match: { "usuario._id": id_user }
            },
            {
                $project: {
                    nombre: 1,
                    edo : 1
                }
            }
        ])
        res.status(200).json(brazalet)
    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

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

//Get last Id
exports.getLastId = async (req, res) => {
    try {
        const lastId = await Bracelet.find({},{_id : 1}).sort({ _id: -1 }).limit(1);
        if (!lastId) {
            return res.status(404).json({ error: 'No se encontró ninguna pulsera' });
        }
        res.status(200).json({_id : lastId[0]._id});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//Compartat ID
exports.shareId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const bracelet = await Bracelet.findById(id);

        if (!bracelet) {
            return res.status(404).json({ error: 'Pulsera no encontrada' });
        }else{
            res.status(200).json({_id : bracelet._id});
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
