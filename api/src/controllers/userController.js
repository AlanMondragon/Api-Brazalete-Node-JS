const User = require('../models/User');
const Reminder = require("../models/Reminder");

// Crear un usuario
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    user.edo = true;
    user.edoReq = 0;
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Solicitudes de cuidadores
exports.getLisKeeper = async (req, res) => {
  try {  
    const users = await User.find(
      { edoReq: 0, edo: true , rol: 'keeper' },  
      { email: 1, phone: 1, name: 1, _id: 0 } 
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(
      { edoReq: 1, edo: true }, 
      { email: 1, phone: 1, name: 1, _id: 0 } 
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un usuario por ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Devuelve el documento actualizado
      runValidators: true // Aplica las validaciones del esquema
    });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Aceptar Solicitud
exports.acceptRequest = async (req, res) => {{
  try {
    const { id } = req.params;
    const user = await User.findOneAndUpdate(
      { _id: id },  // Buscar usuario por email
      { $set: { edoReq : 1 } },  // Actualizar Aceptada
      { new: true, runValidators: true }  // Opciones: devuelve actualizado y valida
    );
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Cuidador aceptadod correctamente', user });
  } catch (error) {
    
  }
}}

// Rechazar Solicitud
exports.denyRequest = async (req, res) => {{
  try {
    const { id } = req.params;
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: { edoReq : 2} },  // Actualizar a rechazar
      { new: true, runValidators: true }  // Opciones: devuelve actualizado y valida
    );
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Cuidador aceptadod correctamente', user });
  } catch (error) {
    
  }
}}

// Desactivar un usuario por ID (Desactivado lógico)
exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params; 
    const user = await User.findByIdAndUpdate(
      id,
      { edo: false }, 
      { new: true, runValidators: true } 
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario desactivado correctamente', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = exports;
