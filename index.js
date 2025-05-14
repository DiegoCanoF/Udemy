const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Configuración de middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas API
const authRoutes = require('./routes/auth');
const cursosRoutes = require('./routes/cursos');
const inscripcionesRoutes = require('./routes/inscripciones');
const videosRoutes = require('./routes/videos');
const formulariosRoutes = require('./routes/formularios');
const imagenesRoutes = require('./routes/imagenes');
const archivosRoutes = require('./routes/archivos');

app.use('/api/auth', authRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/formularios', formulariosRoutes);
app.use('/api/imagenes', imagenesRoutes);
app.use('/api/archivos', archivosRoutes);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Redirigir raíz al login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Iniciar servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
