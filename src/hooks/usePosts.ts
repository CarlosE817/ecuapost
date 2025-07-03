// src/hooks/usePosts.ts
import { useState, useCallback, useEffect } from 'react';
import { PostData, User as AppUser } from '../types';

const API_URL = 'http://localhost:3000/api/posts';

export const usePosts = (appUser: AppUser | null, showToast: (message: string, type?: 'success' | 'info' | 'error') => void) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Cargando posts desde el backend...');
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data: PostData[] = await response.json();
      console.log(`✅ ${data.length} posts cargados exitosamente`);
      
      // Ordenar por fecha descendente (más recientes primero)
      const sortedPosts = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      setPosts(sortedPosts);
      
      if (data.length > 0) {
        showToast(`${data.length} posts cargados`, 'success');
      }
    } catch (e: any) {
      console.error('❌ Error fetching posts:', e);
      const errorMessage = e.message || 'Error al cargar los posts';
      setError(errorMessage);
      showToast(`Error: ${errorMessage}`, 'error');
      setPosts([]);
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

    if (contenido.length > 280) {
      showToast('El post no puede exceder los 280 caracteres.', 'error');
      return;
    }

    console.log('📝 Creando nuevo post...', { contenido: contenido.substring(0, 50) + '...', user_id: appUser.id });
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          contenido: contenido.trim(), 
          user_id: appUser.id 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: `Error ${response.status}: ${response.statusText}` 
        }));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const newPostFromServer: PostData = await response.json();
      console.log('✅ Post creado exitosamente:', newPostFromServer.id);
      
      // Actualizar el estado local inmediatamente para mejor UX
      setPosts(prevPosts => {
        const updatedPosts = [newPostFromServer, ...prevPosts];
        return updatedPosts.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      });
      
      showToast('¡Post publicado exitosamente!', 'success');
    } catch (e: any) {
      console.error('❌ Error creando post:', e);
      const errorMessage = e.message || 'Error al publicar el post';
      showToast(`Error: ${errorMessage}`, 'error');
    }
  }, [appUser, showToast]);

  const handleEditPost = useCallback(async (postId: number, newContent: string) => {
    if (!appUser) {
      showToast('Debes iniciar sesión para editar posts.', 'error');
      return;
    }

    if (!newContent.trim()) {
      showToast('El contenido no puede estar vacío.', 'error');
      return;
    }

    if (newContent.length > 280) {
      showToast('El contenido no puede exceder los 280 caracteres.', 'error');
      return;
    }

    console.log('✏️ Editando post...', { postId, newContent: newContent.substring(0, 50) + '...' });

    try {
      const response = await fetch(`${API_URL}/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          contenido: newContent.trim(), 
          user_id: appUser.id 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: `Error ${response.status}: ${response.statusText}` 
        }));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const updatedPost: PostData = await response.json();
      console.log('✅ Post editado exitosamente:', updatedPost.id);
      
      // Actualizar el estado local
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? updatedPost : post
        ).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      );
      
      showToast('Post editado exitosamente', 'success');
    } catch (e: any) {
      console.error('❌ Error editando post:', e);
      const errorMessage = e.message || 'Error al editar el post';
      showToast(`Error: ${errorMessage}`, 'error');
    }
  }, [appUser, showToast]);

  const handleDeletePost = useCallback(async (postId: number) => {
    if (!appUser) {
      showToast('Debes iniciar sesión para eliminar posts.', 'error');
      return;
    }

    console.log('🗑️ Eliminando post...', { postId });

    try {
      const response = await fetch(`${API_URL}/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: appUser.id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: `Error ${response.status}: ${response.statusText}` 
        }));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Post eliminado exitosamente:', postId);
      
      // Actualizar el estado local
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      
      showToast('Post eliminado exitosamente', 'success');
    } catch (e: any) {
      console.error('❌ Error eliminando post:', e);
      const errorMessage = e.message || 'Error al eliminar el post';
      showToast(`Error: ${errorMessage}`, 'error');
    }
  }, [appUser, showToast]);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    handleNewPost,
    handleEditPost,
    handleDeletePost,
  };
};