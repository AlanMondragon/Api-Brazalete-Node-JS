const Medication = require('../models/Medications');

//Crear Medicamento
exports.createMedication = async (req, res) => {
    try{
        const medi = new Medication(req.body);
        await medi.save();
        res.status(201).json(medi);
    }catch(e){
        
        res.status(400).json({error : e.message})

    }
}