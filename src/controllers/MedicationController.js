const Medication = require('../models/Medications');

//Crear Medicamento
exports.createMedication = async (req, res) => {
    try {
        const medi = new Medication(req.body);
        await medi.save();
        res.status(201).json(medi);
    } catch (e) {

        res.status(400).json({ error: e.message })

    }
}

//Ver todos los medicamentos
exports.getAllMedication = async (req, res) => {
    try {
        const medications = await Medication.find(
            { edo: true },
        );
        res.status(200).json(medications)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

exports.findById = async (req, res) => {
    try {

        const medication = await Medication.findById(req.params.id)
        res.status(200).json(medication)

    } catch (e) {
        res.status(500).json(({ error: e.message }))
    }
}

exports.update = async (req, res) => {
    try {

        const medication = await Medication.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!medication) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }
        res.status(200).json(medication);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}


exports.deactivate = async (req, res) => {
    try {
        const medication = await Medication.findByIdAndUpdate(req.params.id,
            {
                new: true,
                edo: false
            },
        );

        res.status(200).json({message : "elemento desactivado"})
    } catch (e) {
        res.status(400).json({ error : e.message })
    }
}

// Medicamentos desactivados
exports.getAllMedicationDesativate = async (req, res) => {
    try {
        const medication = await Medication.find({
            edo: false
        });
        res.status(200).json(medication);
    } catch(e) {
        res.status(400).json({ error: e.message });
    }
}

//Reactivar medicamentos
exports.reactivate = async (req, res) => {
    try {
        const medication = await Medication.findByIdAndUpdate(req.params.id,
            {
                new: true,
                edo: true
            },
        );

        res.status(200).json({ message: "Elemento activado" })
    } catch (e) {

    }
}