const express = require('express');
const router = express.Router();
const pool = require('../db');

// 🔹 Inscribir a un estudiante en un curso
router.post('/', async (req, res) => {
  const { estudiante_id, curso_id } = req.body;

  if (!estudiante_id || !curso_id) {
    return res.status(400).json({ error: 'Faltan los parámetros: estudiante_id y curso_id' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO inscripciones (estudiante_id, curso_id) VALUES ($1, $2) RETURNING *',
      [estudiante_id, curso_id]
    );

    res.status(201).json({ mensaje: 'Inscripción exitosa', inscripcion: rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      // Ya existe una inscripción (violación de la restricción UNIQUE)
      return res.status(400).json({ error: 'Ya estás inscrito en este curso' });
    }

    console.error('Error al insertar inscripción:', error);
    res.status(500).json({ error: 'Error interno al insertar inscripción' });
  }
});

// 🔹 Obtener los cursos completos en los que un estudiante está inscrito
router.get('/estudiante/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT c.*
       FROM cursos c
       INNER JOIN inscripciones i ON c.id = i.curso_id
       WHERE i.estudiante_id = $1`,
      [id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener cursos del estudiante:', error);
    res.status(500).json({ error: 'Error al obtener los cursos del estudiante' });
  }
});

router.get('/cursos-disponibles/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT c.id, c.titulo, c.descripcion
       FROM cursos c
       LEFT JOIN inscripciones i ON c.id = i.curso_id AND i.estudiante_id = $1
       WHERE i.id IS NULL`,
      [id]
    );

    res.status(200).json(rows); // Asegúrate de que esta parte sea un JSON válido
  } catch (error) {
    console.error('Error al obtener cursos disponibles:', error);
    res.status(500).json({ error: 'Error al obtener cursos disponibles' });
  }
});

// Obtener solo los curso_id de las inscripciones de un estudiante
router.get('/estudiante/:id/ids', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT curso_id FROM inscripciones WHERE estudiante_id = $1',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener curso_id de inscripciones:', error);
    res.status(500).json({ error: 'Error al obtener IDs de inscripciones' });
  }
});

module.exports = router;
