import React from 'react';
import { Calendar, MapPin, Link as LinkIcon } from 'lucide-react';
import { User, Tweet } from '../types';
import TweetCard from './TweetCard';

interface ProfileProps {
  user: User;
  tweets: Tweet[];
  onLike: (tweetId: string) => void;
  onRetweet: (tweetId: string) => void;
  onReply: (tweetId: string) => void;
  onBookmark: (tweetId: string) => void;
  onDelete: (tweetId: string) => void;
  onEdit: (tweetId: string, content: string) => void;
  bookmarkedTweets: string[];
}

const Profile: React.FC<ProfileProps> = ({ 
  user, 
  tweets, 
  onLike, 
  onRetweet, 
  onReply, 
  onBookmark, 
  onDelete, 
  onEdit, 
  bookmarkedTweets 
}) => {
  return (
    <div className="border-l border-r border-gray-200 min-h-screen">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900">Perfil</h1>
      </div>
      
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
        <div className="absolute -bottom-16 left-4">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-32 h-32 rounded-full border-4 border-white"
          />
        </div>
      </div>
      
      <div className="pt-20 px-4 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.displayName}</h2>
            <p className="text-gray-500">@{user.username}</p>
          </div>
          <button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full font-bold transition-colors">
            Editar perfil
          </button>
        </div>
        
        {user.bio && (
          <p className="text-gray-900 mb-4">{user.bio}</p>
        )}
        
        <div className="flex items-center space-x-4 text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Se unió en enero 2024</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Ecuador</span>
          </div>
        </div>
        
        <div className="flex space-x-6 mb-6">
          <div>
            <span className="font-bold text-gray-900">{user.following}</span>
            <span className="text-gray-500 ml-1">Siguiendo</span>
          </div>
          <div>
            <span className="font-bold text-gray-900">{user.followers}</span>
            <span className="text-gray-500 ml-1">Seguidores</span>
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <div className="flex">
          <button className="flex-1 py-4 text-center font-bold text-gray-900 border-b-2 border-blue-500">
            Tweets ({tweets.length})
          </button>
          <button className="flex-1 py-4 text-center text-gray-500 hover:bg-gray-50 transition-colors">
            Respuestas
          </button>
          <button className="flex-1 py-4 text-center text-gray-500 hover:bg-gray-50 transition-colors">
            Media
          </button>
          <button className="flex-1 py-4 text-center text-gray-500 hover:bg-gray-50 transition-colors">
            Me gusta
          </button>
        </div>
      </div>
      
      <div>
        {tweets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-xl font-bold mb-2">No has publicado nada aún</p>
            <p>Cuando publiques tweets, aparecerán aquí.</p>
          </div>
        ) : (
          tweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              onLike={onLike}
              onRetweet={onRetweet}
              onReply={onReply}
              onBookmark={onBookmark}
              onDelete={onDelete}
              onEdit={onEdit}
              isBookmarked={bookmarkedTweets.includes(tweet.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;