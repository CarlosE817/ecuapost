import React from 'react';
import PostCard from './PostCard'; // Importar PostCard
import ComposeBox from './ComposeBox';
import { useAppContext } from '../contexts/AppContext';

const Feed: React.FC = () => { // Renombrar componente
  const { posts, loadingPosts, errorPosts } = useAppContext(); // Usar posts, loadingPosts, errorPosts

  return (
    <div className="border-l border-r border-gray-200 dark:border-gray-800 min-h-screen">
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Inicio</h1>
      </div>

      <ComposeBox /> {/* ComposeBox ya usa handleNewPost del contexto */}

      <div>
        {loadingPosts && (
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">Cargando posts...</p>
        )}
        {errorPosts && (
          <p className="p-4 text-center text-red-500 dark:text-red-400">Error al cargar posts: {errorPosts}</p>
        )}
        {!loadingPosts && !errorPosts && posts.length === 0 && (
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">
            No hay posts todavía. ¡Sé el primero en publicar!
          </p>
        )}
        {!loadingPosts && !errorPosts && posts.map((post) => ( // Usar posts y PostCard
          <PostCard
            key={post.id} // Usar post.id
            post={post}   // Pasar el objeto post
          />
        ))}
      </div>
    </div>
  );
};

export default Feed; // Exportar Feed