import React, { useState } from 'react'; // Added useState for active tab
import { Calendar, MapPin, Edit2 } from 'lucide-react'; // Link as LinkIcon removed as website not shown
// import { User, Tweet } from '../types'; // Types can be inferred or imported if needed locally
import TweetCard from './TweetCard';
import { useAppContext } from '../contexts/AppContext';

// ProfileProps removed
// interface ProfileProps {
//   user: User;
//   tweets: Tweet[];
//   onLike: (tweetId: string) => void;
//   onRetweet: (tweetId: string) => void;
//   onReply: (tweetId: string) => void;
//   onBookmark: (tweetId: string) => void;
//   onDelete: (tweetId: string) => void;
//   onEdit: (tweetId: string, content: string) => void;
//   bookmarkedTweets: string[];
// }

const Profile: React.FC = () => {
  const { appUser, tweets: allTweets, showToast } = useAppContext(); // Renamed tweets to allTweets to avoid conflict
  const [activeTab, setActiveTab] = useState('tweets'); // For handling tabs like Tweets, Replies, Media

  if (!appUser) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400 min-h-screen border-l border-r border-gray-200 dark:border-gray-800">
        <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4 z-10">
           <h1 className="text-xl font-bold text-gray-900 dark:text-white">Perfil</h1>
        </div>
        <p className="mt-10">Inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  // Filter tweets to get only those by the current appUser and sort them
  const userTweets = allTweets
    .filter(tweet => tweet.user.id === appUser.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Attempt to get join date from Firebase user metadata if available through appUser
  const joinDate = appUser.firebaseUser?.metadata?.creationTime
    ? new Date(appUser.firebaseUser.metadata.creationTime).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    : 'Fecha desconocida'; // Fallback if not available

  const handleEditProfile = () => {
    showToast('La edición de perfil estará disponible próximamente.', 'info');
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'tweets':
        return userTweets.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p className="text-xl font-bold mb-2">No has publicado nada aún</p>
            <p>Cuando publiques tweets, aparecerán aquí.</p>
          </div>
        ) : (
          userTweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              // TweetCard handles its own interactions via context
            />
          ))
        );
      case 'replies':
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Las respuestas aparecerán aquí próximamente.</div>;
      case 'media':
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">El contenido multimedia aparecerá aquí próximamente.</div>;
      case 'likes':
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Los tweets que te gustan aparecerán aquí próximamente.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="border-l border-r border-gray-200 dark:border-gray-800 min-h-screen">
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4 z-10">
        {/* Header can show display name if available, or generic "Perfil" */}
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{appUser.displayName || 'Perfil'}</h1>
         <p className="text-gray-500 dark:text-gray-400 text-sm">@{appUser.username}</p>
      </div>
      
      <div className="relative">
        {/* Placeholder for cover image */}
        <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700"></div>
        <div className="absolute -bottom-16 left-4">
          <img
            src={appUser.avatar}
            alt={appUser.displayName}
            className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 object-cover"
          />
        </div>
      </div>
      
      <div className="pt-20 px-4 pb-4">
        <div className="flex justify-end items-start mb-4">
          {/* Edit button removed from original place, was on right side */}
           <button
            onClick={handleEditProfile}
            className="flex items-center space-x-1 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-full font-semibold text-sm transition-colors"
          >
            <Edit2 size={16} />
            <span>Editar perfil</span>
          </button>
        </div>
         <div> {/* Container for name and username, matches original structure more closely */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{appUser.displayName}</h2>
            <p className="text-gray-500 dark:text-gray-400">@{appUser.username}</p>
        </div>
        
        {appUser.bio && (
          <p className="text-gray-900 dark:text-gray-200 my-4">{appUser.bio}</p>
        )}
        
        <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Se unió en {joinDate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            {/* Location can be part of appUser.bio or a new field */}
            <span className="text-sm">Ecuador (Predeterminado)</span>
          </div>
        </div>
        
        <div className="flex space-x-6 mb-6">
          <div>
            <span className="font-bold text-gray-900 dark:text-white">{appUser.following || 0}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Siguiendo</span>
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-white">{appUser.followers || 0}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Seguidores</span>
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex">
          {['tweets', 'replies', 'media', 'likes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-center font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              {tab === 'tweets' ? `Tweets (${userTweets.length})` : tab}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile;