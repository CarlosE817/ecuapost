import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, User } from 'lucide-react';
// import { Tweet } from '../types'; // Tweet type can be inferred
import TweetCard from './TweetCard';
import { trendingTopics } from '../data/mockData'; // Assuming this is still relevant
import { useAppContext } from '../contexts/AppContext';

// ExploreProps removed as data comes from context
// interface ExploreProps {
//   tweets: Tweet[];
//   onLike: (tweetId: string) => void;
//   onRetweet: (tweetId: string) => void;
//   onReply: (tweetId: string) => void;
//   onBookmark: (tweetId: string) => void;
//   bookmarkedTweets: string[];
// }

const Explore: React.FC = () => {
  const { tweets } = useAppContext(); // Get all tweets from context
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('trending'); // Local state for UI tabs

  // Filtered tweets based on search term
  const filteredTweets = useMemo(() => {
    if (!searchTerm.trim()) {
      // When no search term, what to show depends on the tab.
      // For 'latest' tab with no search, it might show all tweets or a subset.
      // For now, let's return all tweets if no search term, and let tabs handle further filtering.
      // Or, if activeTab is 'latest' and no search, latestTweets will be used.
      // This logic might need refinement based on desired behavior for empty search on 'latest'.
      return tweets;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    // console.log('🔍 Buscando:', searchLower);
    // console.log('📊 Total tweets disponibles:', tweets.length);

    const filtered = tweets.filter(tweet => {
      const contentMatch = tweet.content.toLowerCase().includes(searchLower);
      const displayNameMatch = tweet.user.displayName.toLowerCase().includes(searchLower);
      const usernameMatch = tweet.user.username.toLowerCase().includes(searchLower);
      const bioMatch = tweet.user.bio?.toLowerCase().includes(searchLower) || false;
      return contentMatch || displayNameMatch || usernameMatch || bioMatch;
    });

    // console.log('📋 Resultados de búsqueda:', filtered.length);
    return filtered;
  }, [tweets, searchTerm]);

  // Tweets sorted by timestamp for the 'latest' tab
  const latestTweets = useMemo(() => {
    return [...tweets].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [tweets]);

  const displayTweets = useMemo(() => {
    if (searchTerm.trim()) {
      return filteredTweets;
    }
    if (activeTab === 'latest') {
      return latestTweets;
    }
    // For 'trending' or 'people' without search, different content is shown, not a list of TweetCards from `tweets`.
    // If 'trending' tab is active and there's a search, it should show filteredTweets.
    // This means the main list rendering logic needs to consider activeTab and searchTerm.
    return []; // Default to empty if not 'latest' and no search term for general tweet list
  }, [searchTerm, activeTab, filteredTweets, latestTweets]);


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
            {/* Using displayTweets here as it's the list for the current view when searching */}
            {displayTweets.length > 0 ? (
              <span>
                {displayTweets.length} resultado{displayTweets.length !== 1 ? 's' : ''} para "{searchTerm}"
              </span>
            ) : (
              <span className="text-red-500">
                No se encontraron resultados para "{searchTerm}" {/* Keep this specific message for no results */}
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
      
      {/* Display list of tweets if on 'latest' tab OR if there's a search term (results view) */}
      {(activeTab === 'latest' || searchTerm.trim()) && (
        <div>
          {displayTweets.length === 0 ? (
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
                  : 'Cuando haya nuevos tweets, los verás aquí.'
                }
              </p>
            </div>
          ) : (
            <div>
              {displayTweets.map((tweet) => (
                <TweetCard
                  key={tweet.id}
                  tweet={tweet}
                  // Props like onLike, onRetweet, onBookmark, isBookmarked are handled by TweetCard itself using context
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'people' && !searchTerm.trim() && ( // Show placeholder only if no search term
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