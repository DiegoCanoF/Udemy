const express = require('express');
const router = express.Router();
const multer = require('multer'); // Para manejar la subida de archivos
const path = require('path');

// Configuración de multer para almacenar archivos en el directorio 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ruta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Obtener la extensión del archivo
    const filename = Date.now() + fileExtension; // Usar timestamp para evitar conflictos de nombres
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Ruta para subir imágenes
router.post('/', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
  }

  // Responder con la URL de la imagen subida
  res.status(201).json({
    message: 'Imagen subida correctamente',
    url: `/uploads/${req.file.filename}`
  });
});

module.exports = router;
