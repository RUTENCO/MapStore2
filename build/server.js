/* eslint-disable no-console */
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuración del transporte de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia esto si usas otro servicio como Outlook o SMTP personalizado
    auth: {
        user: process.env.MAIL_USER, // Cambia esto a tu correo
        pass: process.env.MAIL_PASS // Usa una contraseña de aplicación (no la contraseña normal)
    }
});

// Ruta para manejar el envío de correos
app.post('/send-email', (req, res) => {
    const { nombre, telefono, descripcion } = req.body;

    const mailOptions = {
        from: 'd.r222403@gmail.com', // Cambia esto a tu correo
        to: 'daniel.ramirez7@udea.edu.co', // Cambia esto a tu correo institucional
        subject: 'Nueva PQRS recibida',
        text: `Nombre: ${nombre}\nTeléfono: ${telefono}\nDescripción: ${descripcion}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error al enviar el correo');
        } else {
            console.log('Correo enviado: ' + info.response);
            res.status(200).send('Correo enviado correctamente');
        }
    });
});

// Iniciar el servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
