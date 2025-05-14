// routes/archivos.js
const express = require('express');
const router = express.Router();

// Define tus rutas aquí
router.get('/', (req, res) => {
  res.send('Ruta de archivos');
});

module.exports = router;
