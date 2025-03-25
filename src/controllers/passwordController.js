const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { Resend } = require('resend');

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Request password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    console.log("Token generado:", token);

    
    // Save token in database with expiration (1 hour from now)
    await PasswordReset.findOneAndDelete({ userId: user._id }); // Remove any existing token
    await new PasswordReset({
      userId: user._id,
      token: token,
      createdAt: Date.now(),
      expiresAt: new Date(Date.now() + 3600000) // 1 hour expiration
    }).save();
    
    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
    
    // For testing: Override recipient email to your verified email in Resend
    const recipientEmail = '20233tn096@utez.edu.mx'; // Your registered email with Resend
    
    // Send email
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use the default Resend sender address
      to: recipientEmail, // Send to your verified email instead of user.email
      subject: 'Recuperación de Contraseña',
      html: `
        <h1>Recuperación de Contraseña</h1>
        <p>Hola ${user.name || user.email},</p>
        <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no solicitaste esto, puedes ignorar este correo.</p>
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
        <a href="${resetLink}">Restablecer Contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Saludos,<br>El equipo de tu aplicación</p>
        
        <p style="color: #666; font-size: 0.8em;">
          <strong>Nota:</strong> Este es un correo de prueba. En un entorno de producción, 
          este correo se enviaría a: ${user.email}
        </p>
      `
    });
    
    if (error) {
      console.error('Error al enviar correo:', error);
      return res.status(500).json({ message: 'Error al enviar correo de recuperación' });
    }
    
    res.status(200).json({ message: 'Correo de recuperación enviado con éxito' });
  } catch (error) {
    console.error('Error en la recuperación de contraseña:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      console.log("Token recibido del cliente:", token);
      
      if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token y nueva contraseña son requeridos' });
      }
      
      // Buscar el token sin verificar expiración
      const anyToken = await PasswordReset.findOne({ token });
      console.log("Token encontrado en DB (sin verificar expiración):", anyToken);
      
      if (!anyToken) {
        return res.status(400).json({ 
          message: 'Token inválido o no encontrado. Posiblemente se ha generado un nuevo token.'
        });
      }
      
      // Verificar expiración
      if (new Date(anyToken.expiresAt) <= new Date()) {
        return res.status(400).json({ 
          message: 'Token expirado. Solicita un nuevo enlace de restablecimiento.'
        });
      }
      
      // Continuar con el restablecimiento de contraseña...
      console.log("Buscando usuario con ID:", anyToken.userId);
      const user = await User.findOne({ _id: anyToken.userId });
      console.log("Usuario encontrado:", user);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
      try {
        // Esta es la parte corregida - No hash manual, deja que el hook pre-save lo haga
        console.log("Actualizando contraseña del usuario...");
        user.password = newPassword; // Asignar contraseña sin hashear
        await user.save(); // El hook pre-save se encargará de hashear la contraseña
        console.log("Contraseña actualizada correctamente");
  
        console.log("Eliminando token de restablecimiento...");
        await PasswordReset.deleteOne({ _id: anyToken._id });
        console.log("Token eliminado correctamente");
  
        res.status(200).json({ message: 'Contraseña actualizada correctamente' });
      } catch (error) {
        console.error("Error en el proceso de actualización:", error);
        res.status(500).json({ message: 'Error al actualizar la contraseña: ' + error.message });
      }
      
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
  };