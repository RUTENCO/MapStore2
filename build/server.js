/* eslint-disable no-console */
require('dotenv').config();
const express    = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors       = require('cors');

const app = express();
app.use(bodyParser.json());

// CORS configurado sólo para tu frontend
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Configuración del transporte de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// Ruta para manejar el envío de correos
app.post('/send-email', (req, res) => {
    const { nombre, telefono, descripcion } = req.body;
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: 'Nueva PQRS recibida',
        text: `Nombre: ${nombre}\nTeléfono: ${telefono}\nDescripción: ${descripcion}`
    };

    // eslint-disable-next-line consistent-return
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al enviar el correo');
        }
        console.log('Correo enviado:', info.response);
        res.send('Correo enviado correctamente');
    });
});

// Inicia el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
