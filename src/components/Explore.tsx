import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, User } from 'lucide-react';
import PostCard from './PostCard'; // Cambiado de TweetCard a PostCard
import { trendingTopics } from '../data/mockData';
import { useAppContext } from '../contexts/AppContext';
import { PostData } from '../types'; // Importar PostData

const Explore: React.FC = () => {
  const { posts, loadingPosts, errorPosts } = useAppContext(); // Usar posts del contexto
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('trending');

  // Filtrar posts basados en el término de búsqueda
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) {
      return posts; // Si no hay búsqueda, devolver todos los posts (para la pestaña 'latest' o resultados)
    }

    const searchLower = searchTerm.toLowerCase().trim();

    // Filtrar PostData
    // Asumimos que PostData tiene `contenido`, `username`, y opcionalmente `displayName`
    // El `bio` del usuario no está directamente en PostData, así que no podemos buscar por él aquí.
    // La búsqueda por autor se hará sobre `post.username` y `post.displayName` si existe.
    const filtered = posts.filter(post => {
      const contentMatch = post.contenido.toLowerCase().includes(searchLower);
      const usernameMatch = post.username.toLowerCase().includes(searchLower);
      const displayNameMatch = post.displayName?.toLowerCase().includes(searchLower) || false;
      return contentMatch || usernameMatch || displayNameMatch;
    });

    return filtered;
  }, [posts, searchTerm]);

  // Posts ordenados por fecha para la pestaña 'latest'
  // 'posts' ya viene ordenado por fecha desde usePosts, pero si quisiéramos re-ordenar o asegurar:
  const latestPosts = useMemo(() => {
    // return [...posts].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    // Si 'posts' del contexto ya está ordenado, podemos simplemente usarlo o una copia.
    return posts; // Asumiendo que posts del contexto ya está ordenado.
  }, [posts]);

  const displayPosts = useMemo(() => { // Renombrado a displayPosts
    if (searchTerm.trim()) {
      return filteredPosts;
    }
    if (activeTab === 'latest') {
      return latestPosts;
    }
    return [];
  }, [searchTerm, activeTab, filteredPosts, latestPosts]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Si hay búsqueda, cambiar automáticamente a la pestaña de resultados
    if (value.trim() && activeTab === 'trending') {
      setActiveTab('latest');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setActiveTab('trending');
  };

  return (
    <div className="border-l border-r border-gray-200 dark:border-gray-800 min-h-screen bg-white dark:bg-gray-900">
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Explorar</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en EcuaPost"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-gray-800 rounded-full border-none outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Mostrar información de búsqueda */}
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {displayPosts.length > 0 ? ( // Usar displayPosts
              <span>
                {displayPosts.length} resultado{displayPosts.length !== 1 ? 's' : ''} para "{searchTerm}"
              </span>
            ) : (
              // No mostrar "No se encontraron resultados" aquí si loadingPosts o errorPosts es true,
              // ya que el mensaje de error/carga se mostrará en la sección de la lista de posts.
              // Solo mostrar si no hay carga ni error, y aun así no hay resultados.
              !loadingPosts && !errorPosts && (
                 <span className="text-red-500">
                    No se encontraron resultados para "{searchTerm}"
                 </span>
              )
            )}
          </div>
        )}
      </div>
      
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 py-4 text-center font-bold transition-colors ${
              activeTab === 'trending'
                ? 'text-gray-900 dark:text-white border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            Tendencias
          </button>
          <button
            onClick={() => setActiveTab('latest')}
            className={`flex-1 py-4 text-center font-bold transition-colors ${
              activeTab === 'latest'
                ? 'text-gray-900 dark:text-white border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {searchTerm ? 'Resultados' : 'Recientes'}
          </button>
          <button
            onClick={() => setActiveTab('people')}
            className={`flex-1 py-4 text-center font-bold transition-colors ${
              activeTab === 'people'
                ? 'text-gray-900 dark:text-white border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            Personas
          </button>
        </div>
      </div>
      
      {activeTab === 'trending' && !searchTerm && (
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Tendencias para ti
          </h2>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                onClick={() => {
                  setSearchTerm(topic.tag);
                  setActiveTab('latest'); // Cambiar a 'latest' para mostrar resultados de posts
                }}
              >
                <p className="text-gray-500 dark:text-gray-400 text-sm">Tendencia en Tecnología</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{topic.tag}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{topic.tweets} Posts</p> {/* Cambiado Tweets a Posts */}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Mostrar lista de posts si está en la pestaña 'latest' O si hay un término de búsqueda */}
      {(activeTab === 'latest' || searchTerm.trim()) && (
        <div>
          {loadingPosts && <p className="p-4 text-center text-gray-500 dark:text-gray-400">Cargando posts...</p>}
          {errorPosts && <p className="p-4 text-center text-red-500 dark:text-red-400">Error: {errorPosts}</p>}
          {!loadingPosts && !errorPosts && displayPosts.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Search className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-xl font-bold mb-2">
                {searchTerm ? 'No se encontraron resultados' : 'No hay posts recientes'}
              </p>
              <p>
                {searchTerm 
                  ? (
                    <>
                      Intenta buscar algo diferente a "{searchTerm}"
                      <br />
                      <button 
                        onClick={clearSearch}
                        className="text-blue-500 hover:underline mt-2 inline-block"
                      >
                        Limpiar búsqueda
                      </button>
                    </>
                  )
                  : 'Cuando haya nuevos posts, los verás aquí.' // Cambiado tweets a posts
                }
              </p>
            </div>
          )}
          {!loadingPosts && !errorPosts && displayPosts.length > 0 && (
            <div>
              {displayPosts.map((post) => ( // Usar displayPosts y PostCard
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'people' && !searchTerm.trim() && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-xl font-bold mb-2">Buscar personas</p>
          <p>Usa la barra de búsqueda para encontrar personas en EcuaPost</p>
        </div>
      )}

      {/* If searching on 'people' tab, this could show person search results if implemented */}
      {activeTab === 'people' && searchTerm.trim() && (
         <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-xl font-bold mb-2">Buscando personas...</p>
          <p>Resultados de búsqueda para "{searchTerm}" en la categoría personas aparecerán aquí.</p>
           <p className="text-xs mt-2 text-gray-400">(Función de búsqueda de personas próximamente)</p>
        </div>
      )}
    </div>
  );
};

export default Explore;