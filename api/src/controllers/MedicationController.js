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

//Ver todos los medicamentos
exports.getAllMedication = async (req, res) => {
    try{
        const medications = await Medication.find();
        res.status(200).json(medications)
    }catch(e){
        res.status(500).json({error : e.message})
    }
}

exports.findById = async (req, res) => {
    try{

        const medication = await Medication.findById(req.params.id)
        res.status(200).json(medication)

    }catch(e){
        res.status(500).json(({error : e.message}))
    }
}

exports.update = async (req, res) => {
    try{
        
        const medication = Medication.updateOne(req.params.id, req.body, {
            new: true, 
            runValidators: true 
          });

    }catch(e){
        if(!medication){
            res.status(400)
        }
    }
}


exports.deactivate = async (req, res) => {
    try{
    const medication = await Medication.findById(req.params.id);
    medication.edo = false;
    res.status(200).json({message : "Elemento desactivado"}, {medication})
    }catch(e){
        
    }
}