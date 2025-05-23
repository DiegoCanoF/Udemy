const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); 



// Importar rutas
const authRoutes = require('./routes/auth');
const cursosRoutes = require('./routes/cursos');  // Asegúrate de que la ruta sea correcta
const inscripcionesRoutes = require('./routes/inscripciones');
const videosRoutes = require('./routes/videos');
const formulariosRoutes = require('./routes/formularios');
const imagenesRoutes = require('./routes/imagenes');
const archivosRoutes = require('./routes/archivos');
const contenidoRoutes = require('./routes/contenido');



// Configuración de middlewares
app.use(cors());
app.use(bodyParser.json());

// Definir rutas
app.use('/api/auth', authRoutes);
app.use('/api/cursos', cursosRoutes);  // Las rutas de cursos están bajo /api/cursos
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/formularios', formulariosRoutes);
app.use('/api/imagenes', imagenesRoutes);
app.use('/api/archivos', archivosRoutes);
app.use('/api/contenido', contenidoRoutes); // ✅ esto ya debería funcionar




// Iniciar servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
