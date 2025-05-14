const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuración de multer para guardar los archivos en una carpeta llamada 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ruta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Obtener la extensión del archivo
    const filename = Date.now() + fileExtension; // Usar timestamp para evitar conflictos de nombres
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Ruta para subir archivos
router.post('/', upload.single('archivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha subido ningún archivo' });
  }

  // Responder con la URL del archivo subido
  res.status(201).json({
    message: 'Archivo subido correctamente',
    url: `/uploads/${req.file.filename}`
  });
});

module.exports = router;
