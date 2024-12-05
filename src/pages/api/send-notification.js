// pages/api/send-notification.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, name, type, category } = req.body;

  // Configure your email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your preferred email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Tu publicación ha sido creada - Barrio Colombiano',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>¡Publicación Exitosa!</h2>
          <p>Hola,</p>
          <p>Tu ${type === 'business' ? 'negocio' : 'anuncio'} "${name}" en la categoría "${category}" ha sido publicado correctamente en Barrio Colombiano.</p>
          <p>Gracias por usar nuestra plataforma.</p>
          <br>
          <p>Saludos,<br>Equipo de Barrio Colombiano</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Notification email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: 'Failed to send notification email', error: error.message });
  }
}