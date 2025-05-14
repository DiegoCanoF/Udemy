const express = require('express');
const router = express.Router();
const pool = require('../db');

// Subir un video a un curso
router.post('/', async (req, res) => {
  const { curso_id, titulo, url } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO videos (curso_id, titulo, url) VALUES ($1, $2, $3) RETURNING *',
      [curso_id, titulo, url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al subir el video:', error);
    res.status(500).json({ error: 'Error al subir el video' });
  }
});

module.exports = router;
