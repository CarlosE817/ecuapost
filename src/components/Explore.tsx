import React, { useState } from 'react';
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

  const filteredTweets = tweets.filter(tweet =>
    tweet.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tweet.user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tweet.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border-l border-r border-gray-200 min-h-screen">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Explorar</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en EcuaPost"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full border-none outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 py-4 text-center font-bold transition-colors ${
              activeTab === 'trending'
                ? 'text-gray-900 border-b-2 border-blue-500'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Tendencias
          </button>
          <button
            onClick={() => setActiveTab('latest')}
            className={`flex-1 py-4 text-center font-bold transition-colors ${
              activeTab === 'latest'
                ? 'text-gray-900 border-b-2 border-blue-500'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Recientes
          </button>
          <button
            onClick={() => setActiveTab('people')}
            className={`flex-1 py-4 text-center font-bold transition-colors ${
              activeTab === 'people'
                ? 'text-gray-900 border-b-2 border-blue-500'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Personas
          </button>
        </div>
      </div>
      
      {activeTab === 'trending' && (
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Tendencias para ti
          </h2>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <p className="text-gray-500 text-sm">Tendencia en Tecnología</p>
                <p className="font-bold text-gray-900 text-lg">{topic.tag}</p>
                <p className="text-gray-500 text-sm">{topic.tweets} Tweets</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {(activeTab === 'latest' || searchTerm) && (
        <div>
          {filteredTweets.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-bold mb-2">
                {searchTerm ? 'No se encontraron resultados' : 'No hay tweets recientes'}
              </p>
              <p>
                {searchTerm 
                  ? `Intenta buscar algo diferente a "${searchTerm}"`
                  : 'Los tweets más recientes aparecerán aquí'
                }
              </p>
            </div>
          ) : (
            filteredTweets.map((tweet) => (
              <TweetCard
                key={tweet.id}
                tweet={tweet}
                onLike={onLike}
                onRetweet={onRetweet}
                onReply={onReply}
                onBookmark={onBookmark}
                isBookmarked={bookmarkedTweets.includes(tweet.id)}
              />
            ))
          )}
        </div>
      )}
      
      {activeTab === 'people' && (
        <div className="p-8 text-center text-gray-500">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-bold mb-2">Buscar personas</p>
          <p>Usa la barra de búsqueda para encontrar personas en EcuaPost</p>
        </div>
      )}
    </div>
  );
};

export default Explore;