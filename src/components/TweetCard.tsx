import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat, Share, MoreHorizontal, BadgeCheck, Bookmark, Trash2, Edit3 } from 'lucide-react';
import { Tweet } from '../types';
import { currentUser } from '../data/mockData';

interface TweetCardProps {
  tweet: Tweet;
  onLike: (tweetId: string) => void;
  onRetweet: (tweetId: string) => void;
  onReply: (tweetId: string) => void;
  onBookmark: (tweetId: string) => void;
  onDelete?: (tweetId: string) => void;
  onEdit?: (tweetId: string, content: string) => void;
  isBookmarked: boolean;
}

const TweetCard: React.FC<TweetCardProps> = ({ 
  tweet, 
  onLike, 
  onRetweet, 
  onReply, 
  onBookmark, 
  onDelete, 
  onEdit, 
  isBookmarked 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const isOwnTweet = tweet.user.id === currentUser.id;

  const handleEdit = () => {
    if (onEdit && editContent.trim() && editContent !== tweet.content) {
      onEdit(tweet.id, editContent);
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('¿Estás seguro de que quieres eliminar este tweet?')) {
      onDelete(tweet.id);
    }
    setShowMenu(false);
  };

  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex space-x-3">
        <img
          src={tweet.user.avatar}
          alt={tweet.user.displayName}
          className="w-12 h-12 rounded-full"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-gray-900 truncate">{tweet.user.displayName}</h3>
            {tweet.user.verified && (
              <BadgeCheck className="h-5 w-5 text-blue-500" />
            )}
            <span className="text-gray-500 truncate">@{tweet.user.username}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{formatTime(tweet.timestamp)}</span>
            <div className="ml-auto relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <button
                    onClick={() => {
                      onBookmark(tweet.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current text-blue-500' : ''}`} />
                    <span>{isBookmarked ? 'Quitar bookmark' : 'Guardar tweet'}</span>
                  </button>
                  
                  {isOwnTweet && onEdit && (
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Editar tweet</span>
                    </button>
                  )}
                  
                  {isOwnTweet && onDelete && (
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar tweet</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-2">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  maxLength={280}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(tweet.content);
                    }}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEdit}
                    disabled={!editContent.trim() || editContent === tweet.content}
                    className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-900 text-base leading-relaxed">{tweet.content}</p>
            )}
            
            {tweet.images && tweet.images.length > 0 && (
              <div className="mt-3 rounded-2xl overflow-hidden">
                <img
                  src={tweet.images[0]}
                  alt="Tweet image"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4 max-w-md">
            <button
              onClick={() => onReply(tweet.id)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 group transition-colors"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </div>
              <span className="text-sm">{formatNumber(tweet.replies)}</span>
            </button>
            
            <button
              onClick={() => onRetweet(tweet.id)}
              className={`flex items-center space-x-2 group transition-colors ${
                tweet.retweeted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
              }`}
            >
              <div className={`p-2 rounded-full group-hover:bg-green-50 transition-colors ${
                tweet.retweeted ? 'bg-green-50' : ''
              }`}>
                <Repeat className="h-5 w-5" />
              </div>
              <span className="text-sm">{formatNumber(tweet.retweets)}</span>
            </button>
            
            <button
              onClick={() => onLike(tweet.id)}
              className={`flex items-center space-x-2 group transition-colors ${
                tweet.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <div className={`p-2 rounded-full group-hover:bg-red-50 transition-colors ${
                tweet.liked ? 'bg-red-50' : ''
              }`}>
                <Heart className={`h-5 w-5 ${tweet.liked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-sm">{formatNumber(tweet.likes)}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 group transition-colors">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <Share className="h-5 w-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;