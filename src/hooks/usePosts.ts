// src/hooks/usePosts.ts
import { useState, useCallback, useEffect } from 'react';
import { PostData, User as AppUser } from '../types';

// const API_URL = 'http://localhost:3000/api/posts'; // Comentado temporalmente

// --- Mock Data ---
const MOCK_POSTS: PostData[] = [
  {
    id: 1,
    contenido: '¡Explorando EcuaPost en mi móvil! 📱🇪🇨 Este es un post de ejemplo para ver cómo se adapta la interfaz. ¡Qué emoción!',
    user_id: 'mockUser001',
    fecha: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // Hace 30 mins
    username: 'devtester',
    displayName: 'Dev Tester 🧑‍💻',
    avatar: 'https://ui-avatars.com/api/?name=DT&background=3498db&color=fff',
    likes_count: 15,
    comments_count: 3,
  },
  {
    id: 2,
    contenido: 'Segundo post de prueba. Probando un texto un poco más largo para ver el ajuste de líneas y la legibilidad en pantallas pequeñas. TailwindCSS debería ayudar mucho con esto. #React #MobileFriendly',
    user_id: 'mockUser002',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // Hace 2 horas
    username: 'uimock',
    displayName: 'UI Mockster ✨',
    avatar: 'https://ui-avatars.com/api/?name=UM&background=e74c3c&color=fff',
    likes_count: 8,
    comments_count: 1,
  },
  {
    id: 3,
    contenido: 'Solo un post corto. #EcuaPost',
    user_id: 'mockUser001', // Mismo usuario que el primero
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // Hace 5 horas
    username: 'devtester',
    displayName: 'Dev Tester 🧑‍💻',
    avatar: 'https://ui-avatars.com/api/?name=DT&background=3498db&color=fff',
    likes_count: 5,
    comments_count: 0,
  },
];
// --- Fin Mock Data ---

export const usePosts = (appUser: AppUser | null, showToast: (message: string, type?: 'success' | 'info' | 'error') => void) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(false); // Simular carga
  const [error, setError] = useState<string | null>(null); // No se usará mucho con mock data

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('Simulando fetchPosts con MOCK_POSTS...');
    await new Promise(resolve => setTimeout(resolve, 700)); // Simular delay de red

    const sortedMockPosts = [...MOCK_POSTS].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    setPosts(sortedMockPosts);

    // showToast('Posts (simulados) cargados.', 'info'); // Opcional: toastear carga de mocks
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleNewPost = useCallback(async (contenido: string) => {
    if (!appUser) {
      showToast('Debes iniciar sesión para publicar (simulado).', 'error');
      return;
    }
    if (!contenido.trim()) {
      showToast('El contenido del post no puede estar vacío (simulado).', 'info');
      return;
    }

    console.log('Simulando handleNewPost...');
    setLoading(true); // Simular carga brevemente
    await new Promise(resolve => setTimeout(resolve, 300));

    const newMockPost: PostData = {
      id: Date.now(), // ID simple para mock, no numérico como en el tipo original, pero ok para simulación
      contenido,
      user_id: appUser.id,
      fecha: new Date().toISOString(),
      username: appUser.username, // Usar username del appUser
      displayName: appUser.displayName, // Usar displayName del appUser
      avatar: appUser.avatar, // Usar avatar del appUser
      likes_count: 0,
      comments_count: 0,
    };

    setPosts(prevPosts => [newMockPost, ...prevPosts].sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));
    showToast('¡Post publicado (simulado)!', 'success');
    setLoading(false);
  }, [appUser, showToast]);

  // --- Funciones comentadas (Likes, Retweets, etc.) ---
  // const handleLike = useCallback((postId: number) => {
  //   // Lógica para interactuar con el backend para likes
  //   showToast('Función de Like próximamente...', 'info');
  // }, [showToast]);

  // const handleRetweet = useCallback((postId: number) => {
  //   // Lógica para interactuar con el backend para retweets
  //   showToast('Función de Retweet próximamente...', 'info');
  // }, [showToast]);

  // const handleReply = useCallback((postId: number) => {
  //   console.log('Reply to post:', postId);
  //   showToast('Función de respuesta próximamente...', 'info');
  // }, [showToast]);

  // const handleDeletePost = useCallback(async (postId: number) => {
  //   // Lógica para DELETE /posts/:id
  //   // setPosts(prev => prev.filter(post => post.id !== postId));
  //   showToast('Post eliminado (simulado)', 'success');
  // }, [showToast]);

  // const handleEditPost = useCallback(async (postId: number, newContent: string) => {
  //   // Lógica para PUT /posts/:id
  //   // setPosts(prev => prev.map(post =>
  //   //   post.id === postId ? { ...post, contenido: newContent, fecha: new Date().toISOString() } : post
  //   // ));
  //   showToast('Post editado (simulado)', 'success');
  // }, [showToast]);

  return {
    posts, // Renombrado de tweets a posts
    // setPosts, // Exponer setPosts si es necesario para manipulación directa
    loading, // Loading general para fetchPosts
    error,   // Error general para fetchPosts
    fetchPosts, // Exponer para re-fetch manual si es necesario
    handleNewPost, // Renombrado de handleNewTweet
    // handleLike,
    // handleRetweet,
    // handleReply,
    // handleDeletePost,
    // handleEditPost,
  };
};
