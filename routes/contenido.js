// routes/contenido.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombrar el archivo con timestamp
  },
});

const upload = multer({ storage: storage });

// Ruta para subir archivos
router.post('/:tipo', upload.single('archivo'), (req, res) => {
  const { tipo } = req.params;
  const archivo = req.file;

  if (!archivo) {
    return res.status(400).json({ error: 'No se ha subido ningún archivo' });
  }

  // Aquí se puede agregar lógica para asociar el archivo con un curso en la base de datos
  res.status(200).json({
    message: 'Archivo subido correctamente',
    tipo,
    archivo: archivo.filename,
  });
});

module.exports = router;
