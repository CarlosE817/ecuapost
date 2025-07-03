const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos en memoria (en producción usarías una BD real)
let posts = [
  {
    id: 1,
    contenido: "¡Bienvenidos a EcuaPost! Esta es la nueva red social ecuatoriana 🇪🇨",
    user_id: "demo-user",
    fecha: new Date().toISOString(),
    username: "ecuapost_oficial",
    displayName: "EcuaPost Oficial",
    avatar: "https://ui-avatars.com/api/?name=EcuaPost&background=3b82f6&color=fff",
    likes_count: 15,
    comments_count: 3
  },
  {
    id: 2,
    contenido: "Probando las funcionalidades de la plataforma. ¡Todo funciona perfectamente! 🚀",
    user_id: "demo-user-2",
    fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    username: "usuario_demo",
    displayName: "Usuario Demo",
    avatar: "https://ui-avatars.com/api/?name=Usuario+Demo&background=10b981&color=fff",
    likes_count: 8,
    comments_count: 1
  }
];

let nextId = 3;

// Rutas de la API

// GET /api/posts - Obtener todos los posts
app.get('/api/posts', (req, res) => {
  try {
    console.log(`📖 GET /api/posts - Devolviendo ${posts.length} posts`);
    res.json(posts);
  } catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST /api/posts - Crear un nuevo post
app.post('/api/posts', (req, res) => {
  try {
    const { contenido, user_id } = req.body;

    // Validaciones
    if (!contenido || !contenido.trim()) {
      return res.status(400).json({ message: 'El contenido es requerido' });
    }

    if (!user_id) {
      return res.status(400).json({ message: 'El user_id es requerido' });
    }

    if (contenido.length > 280) {
      return res.status(400).json({ message: 'El contenido no puede exceder 280 caracteres' });
    }

    // Crear el nuevo post
    const newPost = {
      id: nextId++,
      contenido: contenido.trim(),
      user_id,
      fecha: new Date().toISOString(),
      username: `user_${user_id.slice(-8)}`, // Generar username basado en user_id
      displayName: `Usuario ${user_id.slice(-4)}`, // Generar displayName
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(`Usuario ${user_id.slice(-4)}`)}&background=random`,
      likes_count: 0,
      comments_count: 0
    };

    // Agregar al inicio del array para que aparezca primero
    posts.unshift(newPost);

    console.log(`✅ POST /api/posts - Nuevo post creado:`, {
      id: newPost.id,
      contenido: newPost.contenido.substring(0, 50) + '...',
      user_id: newPost.user_id
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error al crear post:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/posts/:id - Obtener un post específico
app.get('/api/posts/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    console.log(`📖 GET /api/posts/${id} - Post encontrado`);
    res.json(post);
  } catch (error) {
    console.error('Error al obtener post:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT /api/posts/:id - Actualizar un post
app.put('/api/posts/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { contenido, user_id } = req.body;

    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    const post = posts[postIndex];

    // Verificar que el usuario sea el propietario del post
    if (post.user_id !== user_id) {
      return res.status(403).json({ message: 'No tienes permisos para editar este post' });
    }

    // Validar contenido
    if (!contenido || !contenido.trim()) {
      return res.status(400).json({ message: 'El contenido es requerido' });
    }

    if (contenido.length > 280) {
      return res.status(400).json({ message: 'El contenido no puede exceder 280 caracteres' });
    }

    // Actualizar el post
    posts[postIndex] = {
      ...post,
      contenido: contenido.trim(),
      fecha: new Date().toISOString() // Actualizar fecha de modificación
    };

    console.log(`✏️ PUT /api/posts/${id} - Post actualizado`);
    res.json(posts[postIndex]);
  } catch (error) {
    console.error('Error al actualizar post:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// DELETE /api/posts/:id - Eliminar un post
app.delete('/api/posts/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { user_id } = req.body;

    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    const post = posts[postIndex];

    // Verificar que el usuario sea el propietario del post
    if (post.user_id !== user_id) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar este post' });
    }

    // Eliminar el post
    posts.splice(postIndex, 1);

    console.log(`🗑️ DELETE /api/posts/${id} - Post eliminado`);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Posts iniciales cargados: ${posts.length}`);
  console.log('📡 Endpoints disponibles:');
  console.log('   GET    /api/posts');
  console.log('   POST   /api/posts');
  console.log('   GET    /api/posts/:id');
  console.log('   PUT    /api/posts/:id');
  console.log('   DELETE /api/posts/:id');
});

module.exports = app;