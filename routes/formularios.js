const express = require('express');
const router = express.Router();
const pool = require('../db');  // Asegúrate de que 'pool' esté configurado correctamente para interactuar con tu base de datos

// Crear un formulario
router.post('/', async (req, res) => {
  const { curso_id, titulo, contenido } = req.body;

  // Validar que los datos sean correctos
  if (!curso_id || !titulo || !contenido) {
    return res.status(400).json({ error: 'Faltan datos requeridos (curso_id, titulo, contenido)' });
  }

  try {
    // Insertar el formulario en la base de datos
    const result = await pool.query(
      'INSERT INTO formularios (curso_id, titulo, contenido) VALUES ($1, $2, $3) RETURNING *',
      [curso_id, titulo, JSON.stringify(contenido)] // Guardar el contenido como JSON
    );

    // Responder con el formulario creado
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el formulario' });
  }
});

// Obtener todos los formularios de un curso
router.get('/:curso_id', async (req, res) => {
  const { curso_id } = req.params;

  try {
    // Obtener los formularios del curso
    const result = await pool.query(
      'SELECT * FROM formularios WHERE curso_id = $1',
      [curso_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron formularios para este curso' });
    }

    // Responder con los formularios encontrados
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los formularios' });
  }
});

module.exports = router;
