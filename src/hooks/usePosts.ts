// src/hooks/usePosts.ts
import { useState, useCallback, useEffect } from 'react';
import { PostData, User as AppUser } from '../types'; // Renamed User to AppUser for clarity if needed, using PostData

const API_URL = 'http://localhost:3000/posts';

export const usePosts = (appUser: AppUser | null, showToast: (message: string, type?: 'success' | 'info' | 'error') => void) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data: PostData[] = await response.json();
      // Aquí podrías transformar la 'fecha' de string a Date si lo prefieres,
      // pero el tipo PostData la define como string por ahora.
      setPosts(data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())); // Ordenar por fecha descendente
      showToast('Posts cargados desde el backend.', 'success');
    } catch (e: any) {
      console.error('Error fetching posts:', e);
      setError(e.message || 'Error al cargar los posts.');
      showToast(e.message || 'Error al cargar los posts.', 'error');
      setPosts([]); // Limpiar posts en caso de error
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleNewPost = useCallback(async (contenido: string) => {
    if (!appUser) {
      showToast('Debes iniciar sesión para publicar.', 'error');
      return;
    }
    if (!contenido.trim()) {
      showToast('El contenido del post no puede estar vacío.', 'info');
      return;
    }

    setLoading(true); // Podríamos tener un loading específico para la creación
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contenido, user_id: appUser.id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const newPostFromServer: PostData = await response.json();
      // Añadir el nuevo post al principio de la lista local para UI inmediata
      // o mejor, volver a hacer fetch para consistencia, aunque puede ser más lento.
      // Por ahora, añadimos localmente y luego re-fetch podría ser una opción.
      setPosts(prevPosts => [newPostFromServer, ...prevPosts].sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));
      showToast('¡Post publicado exitosamente!', 'success');
      // Opcional: llamar a fetchPosts() para recargar todo y asegurar consistencia.
      // await fetchPosts();
    } catch (e: any) {
      console.error('Error creando post:', e);
      showToast(e.message || 'Error al publicar el post.', 'error');
    } finally {
      setLoading(false); // Fin del loading de creación
    }
  }, [appUser, showToast]); // fetchPosts no necesita estar aquí si no se llama

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
