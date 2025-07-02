import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, User } from 'lucide-react';
import { Tweet } from '../types';
import TweetCard from './TweetCard';
import { trendingTopics } from '../data/mockData';

interface ExploreProps {
  tweets: Tweet[];
  onLike: (tweetId: string) => void;
  onRetweet: (tweetId: string) => void;
  onReply: (tweetId: string) => void;
  onBookmark: (tweetId: string) => void;
  bookmarkedTweets: string[];
}

const Explore: React.FC<ExploreProps> = ({ 
  tweets, 
  onLike, 
  onRetweet, 
  onReply, 
  onBookmark, 
  bookmarkedTweets 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('trending');

  // Mejorar la función de filtrado con useMemo para optimización
  const filteredTweets = useMemo(() => {
    if (!searchTerm.trim()) {
      return tweets;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    console.log('🔍 Buscando:', searchLower);
    console.log('📊 Total tweets disponibles:', tweets.length);

    const filtered = tweets.filter(tweet => {
      // Buscar en el contenido del tweet
      const contentMatch = tweet.content.toLowerCase().includes(searchLower);
      
      // Buscar en el nombre de usuario
      const displayNameMatch = tweet.user.displayName.toLowerCase().includes(searchLower);
      
      // Buscar en el username
      const usernameMatch = tweet.user.username.toLowerCase().includes(searchLower);
      
      // Buscar en la bio del usuario (si existe)
      const bioMatch = tweet.user.bio?.toLowerCase().includes(searchLower) || false;

      const isMatch = contentMatch || displayNameMatch || usernameMatch || bioMatch;
      
      if (isMatch) {
        console.log('✅ Tweet encontrado:', {
          id: tweet.id,
          content: tweet.content.substring(0, 50) + '...',
          user: tweet.user.displayName,
          matchType: contentMatch ? 'content' : displayNameMatch ? 'displayName' : usernameMatch ? 'username' : 'bio'
        });
      }
      
      return isMatch;
    });

    console.log('📋 Resultados de búsqueda:', filtered.length);
    return filtered;
  }, [tweets, searchTerm]);

  // Tweets más recientes (ordenados por fecha)
  const latestTweets = useMemo(() => {
    return [...tweets].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [tweets]);

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
            {filteredTweets.length > 0 ? (
              <span>
                {filteredTweets.length} resultado{filteredTweets.length !== 1 ? 's' : ''} para "{searchTerm}"
              </span>
            ) : (
              <span className="text-red-500">
                No se encontraron resultados para "{searchTerm}"
              </span>
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
                  setActiveTab('latest');
                }}
              >
                <p className="text-gray-500 dark:text-gray-400 text-sm">Tendencia en Tecnología</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{topic.tag}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{topic.tweets} Tweets</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'latest' && (
        <div>
          {(searchTerm ? filteredTweets : latestTweets).length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Search className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-xl font-bold mb-2">
                {searchTerm ? 'No se encontraron resultados' : 'No hay tweets recientes'}
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
                  : 'Los tweets más recientes aparecerán aquí'
                }
              </p>
            </div>
          ) : (
            <div>
              {(searchTerm ? filteredTweets : latestTweets).map((tweet) => (
                <TweetCard
                  key={tweet.id}
                  tweet={tweet}
                  onLike={onLike}
                  onRetweet={onRetweet}
                  onReply={onReply}
                  onBookmark={onBookmark}
                  isBookmarked={bookmarkedTweets.includes(tweet.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'people' && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-xl font-bold mb-2">Buscar personas</p>
          <p>Usa la barra de búsqueda para encontrar personas en EcuaPost</p>
          {searchTerm && (
            <div className="mt-4">
              <p className="text-sm">Buscando personas que coincidan con: "{searchTerm}"</p>
              <p className="text-xs mt-2 text-gray-400">Esta función estará disponible próximamente</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Explore;