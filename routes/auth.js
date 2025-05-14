const express = require('express');
const router = express.Router();
const pool = require('../db');

// Registro
router.post('/registro', async (req, res) => {
    const { nombre, email, contraseña, rol } = req.body;
  
    if (!['estudiante', 'profesor'].includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }
  
    try {
      const result = await pool.query(
        'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, email, contraseña, rol]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('ERROR:', err); // <-- Esta línea te mostrará el error exacto en la consola
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  });
  
  // Login
  router.post('/login', async (req, res) => {
    const { email, contraseña } = req.body;
  
    try {
      const result = await pool.query(
        'SELECT * FROM usuarios WHERE email = $1 AND contraseña = $2',
        [email, contraseña]
      );
  
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }
  
      res.json({
        mensaje: 'Login exitoso',
        usuario: result.rows[0]
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error en el login' });
    }
  });

module.exports = router;
