const express = require('express');
const router = express.Router();
const pool = require('../db');



router.get('/:id/contenido', async (req, res) => {
  const cursoId = req.params.id;

  try {
    const [contenido] = await pool.query(
      'SELECT * FROM contenido WHERE curso_id = ?',
      [cursoId]
    );

    res.json(contenido);
  } catch (error) {
    console.error('Error al obtener contenido del curso:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});



// Obtener los alumnos inscritos en un curso
router.get('/:id/alumnos', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT u.id, u.nombre, u.email
      FROM usuarios u
      INNER JOIN inscripciones i ON u.id = i.estudiante_id
      WHERE i.curso_id = $1
    `;
    const result = await pool.query(query, [id]);

    res.json({
      cantidad: result.rows.length,
      alumnos: result.rows
    });
  } catch (error) {
    console.error('Error al obtener alumnos del curso:', error);
    res.status(500).json({ error: 'Error al obtener alumnos del curso' });
  }
});





// Crear un nuevo curso
router.post('/', async (req, res) => {
  const { titulo, descripcion, profesor_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cursos (titulo, descripcion, profesor_id) VALUES ($1, $2, $3) RETURNING *',
      [titulo, descripcion, profesor_id]
    );
    res.status(201).json(result.rows[0]); // Devuelve el curso recién creado
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({ error: 'Error al crear curso' });
  }
});

// Actualizar curso
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion } = req.body;
  try {
    const result = await pool.query(
      'UPDATE cursos SET titulo = $1, descripcion = $2 WHERE id = $3 RETURNING *',
      [titulo, descripcion, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json(result.rows[0]); // Devuelve el curso actualizado
  } catch (err) {
    console.error('Error al actualizar el curso:', err);
    res.status(500).json({ error: 'Error al actualizar el curso' });
  }
});

// Obtener todos los cursos de un profesor
router.get('/profesor/:profesorId', async (req, res) => {
  const { profesorId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM cursos WHERE profesor_id = $1',
      [profesorId]
    );
    res.json(result.rows); // Devuelve los cursos del profesor
  } catch (error) {
    console.error('Error al obtener cursos del profesor:', error);
    res.status(500).json({ error: 'Error al obtener los cursos del profesor' });
  }
});

// Obtener la información básica de un curso
router.get('/cursos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM cursos WHERE id = $1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.status(200).json(rows[0]); // Devuelve la información básica del curso
  } catch (error) {
    console.error('Error al obtener el curso:', error);
    res.status(500).json({ error: 'Error al obtener la información del curso' });
  }
});


// Agregar nuevo contenido
router.post('/contenido', async (req, res) => {
  const { curso_id, tipo, titulo, url } = req.body;

  try {
    // Dependiendo del tipo de contenido, deberás insertar en la tabla correspondiente
    let query, params;

    switch (tipo) {
      case 'video':
        query = 'INSERT INTO videos (curso_id, titulo, url) VALUES ($1, $2, $3) RETURNING *';
        params = [curso_id, titulo, url];
        break;
      case 'imagen':
        query = 'INSERT INTO imagenes (curso_id, titulo, url) VALUES ($1, $2, $3) RETURNING *';
        params = [curso_id, titulo, url];
        break;
      case 'formulario':
        query = 'INSERT INTO formularios (curso_id, titulo, contenido) VALUES ($1, $2, $3) RETURNING *';
        params = [curso_id, titulo, url]; // Se asume que la URL es el contenido
        break;
      case 'crucigrama':
        query = 'INSERT INTO crucigramas (curso_id, titulo, contenido) VALUES ($1, $2, $3) RETURNING *';
        params = [curso_id, titulo, url]; // Se asume que la URL es el contenido
        break;
      default:
        return res.status(400).json({ error: 'Tipo de contenido no válido' });
    }

    const result = await pool.query(query, params);
    res.status(201).json(result.rows[0]); // Devuelve el contenido agregado
  } catch (error) {
    console.error('Error al agregar contenido:', error);
    res.status(500).json({ error: 'Error al agregar contenido' });
  }
});

// Obtener el contenido del curso (videos, formularios, crucigramas, imágenes, archivos)
router.get('/cursos/:id/contenido', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT v.titulo AS video_titulo, v.url AS video_url, 
              f.titulo AS formulario_titulo, f.contenido AS formulario_contenido, 
              c.titulo AS crucigrama_titulo, c.contenido AS crucigrama_contenido, 
              a.nombre AS archivo_nombre, a.url AS archivo_url, 
              i.titulo AS imagen_titulo, i.url AS imagen_url
       FROM cursos cu
       LEFT JOIN videos v ON cu.id = v.curso_id
       LEFT JOIN formularios f ON cu.id = f.curso_id
       LEFT JOIN crucigramas c ON cu.id = c.curso_id
       LEFT JOIN archivos a ON cu.id = a.curso_id
       LEFT JOIN imagenes i ON cu.id = i.curso_id
       WHERE cu.id = $1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contenido del curso no encontrado' });
    }
    res.status(200).json(rows); // Devuelve el contenido del curso
  } catch (error) {
    console.error('Error al obtener el contenido del curso:', error);
    res.status(500).json({ error: 'Error al obtener el contenido del curso' });
  }
});

// Listar todos los cursos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cursos');
    res.status(200).json(result.rows); // Devuelve todos los cursos
  } catch (err) {
    console.error('Error al obtener los cursos:', err);
    res.status(500).json({ error: 'Error al obtener los cursos' });
  }
});

// Obtener un curso específico por su ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM cursos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json(result.rows[0]); // Devuelve el curso por su ID
  } catch (err) {
    console.error('Error al obtener el curso:', err);
    res.status(500).json({ error: 'Error al obtener el curso' });
  }
});

module.exports = router;
