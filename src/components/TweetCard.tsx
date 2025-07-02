import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Repeat, Share, MoreHorizontal, BadgeCheck, Bookmark, Trash2, Edit3 } from 'lucide-react';
import { Tweet } from '../types';
// import { useAuth } from '../hooks/useAuth'; // Replaced by useAppContext
import { useAppContext } from '../contexts/AppContext';

interface TweetCardProps {
  tweet: Tweet;
  // onLike, onRetweet, etc. are removed as they will come from context
  // isBookmarked is also removed, will be checked via context
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet }) => {
  const {
    appUser, // to check if it's the user's own tweet
    handleLikeTweet,
    handleRetweetTweet,
    handleReplyTweet,
    handleBookmarkTweet,
    handleDeleteTweet,
    handleEditTweet,
    isTweetBookmarked,
    showToast, // For potential local actions/feedback not covered by global handlers
  } = useAppContext();

  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);
  // const { user } = useAuth(); // firebaseUser is in appUser from context

  // Update editContent if tweet.content changes externally (e.g. optimistic updates elsewhere)
  useEffect(() => {
    setEditContent(tweet.content);
  }, [tweet.content]);

  const isBookmarked = isTweetBookmarked(tweet.id); // Get bookmark status from context

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

  const isOwnTweet = appUser && tweet.user.id === appUser.id;

  const handleSaveChanges = () => {
    if (handleEditTweet && editContent.trim() && editContent !== tweet.content) {
      handleEditTweet(tweet.id, editContent.trim());
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const confirmAndDelete = () => {
    if (handleDeleteTweet && window.confirm('¿Estás seguro de que quieres eliminar este tweet?')) {
      handleDeleteTweet(tweet.id);
    }
    setShowMenu(false);
  };

  const renderImages = () => {
    if (!tweet.images || tweet.images.length === 0) return null;

    const imageCount = tweet.images.length;

    if (imageCount === 1) {
      return (
        <div className="mt-3 rounded-2xl overflow-hidden">
          <img
            src={tweet.images[0]}
            alt="Tweet image"
            className="w-full h-64 object-cover cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => window.open(tweet.images![0], '_blank')}
          />
        </div>
      );
    }

    if (imageCount === 2) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden">
          {tweet.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Tweet image ${index + 1}`}
              className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => window.open(image, '_blank')}
            />
          ))}
        </div>
      );
    }

    if (imageCount === 3) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden">
          <img
            src={tweet.images[0]}
            alt="Tweet image 1"
            className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-opacity row-span-2"
            onClick={() => window.open(tweet.images![0], '_blank')}
          />
          <div className="grid grid-rows-2 gap-1">
            {tweet.images.slice(1).map((image, index) => (
              <img
                key={index + 1}
                src={image}
                alt={`Tweet image ${index + 2}`}
                className="w-full h-24 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => window.open(image, '_blank')}
              />
            ))}
          </div>
        </div>
      );
    }

    if (imageCount === 4) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden">
          {tweet.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Tweet image ${index + 1}`}
              className="w-full h-32 object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => window.open(image, '_blank')}
            />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors bg-white dark:bg-gray-900">
      <div className="flex space-x-3">
        <img
          src={tweet.user.avatar}
          alt={tweet.user.displayName}
          className="w-12 h-12 rounded-full"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-gray-900 dark:text-white truncate">{tweet.user.displayName}</h3>
            {tweet.user.verified && (
              <BadgeCheck className="h-5 w-5 text-blue-500" />
            )}
            <span className="text-gray-500 dark:text-gray-400 truncate">@{tweet.user.username}</span>
            <span className="text-gray-500 dark:text-gray-400">·</span>
            <span className="text-gray-500 dark:text-gray-400">{formatTime(tweet.timestamp)}</span>
            <div className="ml-auto relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"
                aria-label="More options"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                  <button
                    onClick={() => {
                      handleBookmarkTweet(tweet.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-900 dark:text-white"
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current text-blue-500' : ''}`} />
                    <span>{isBookmarked ? 'Quitar bookmark' : 'Guardar tweet'}</span>
                  </button>
                  
                  {isOwnTweet && handleEditTweet && (
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditContent(tweet.content); // Reset edit content to current tweet content
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-900 dark:text-white"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Editar tweet</span>
                    </button>
                  )}
                  
                  {isOwnTweet && handleDeleteTweet && (
                    <button
                      onClick={confirmAndDelete}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-600"
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
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows={3}
                  maxLength={280}
                  aria-label="Edit tweet content"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(tweet.content);
                    }}
                    className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={!editContent.trim() || editContent.trim() === tweet.content}
                    className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-900 dark:text-white text-base leading-relaxed">{tweet.content}</p>
            )}
            
            {renderImages()}
          </div>
          
          <div className="flex items-center justify-between mt-4 max-w-md">
            <button
              onClick={() => handleReplyTweet(tweet.id)}
              className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 group transition-colors"
              aria-label={`Reply to tweet, ${tweet.replies} replies`}
            >
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </div>
              <span className="text-sm">{formatNumber(tweet.replies)}</span>
            </button>
            
            <button
              onClick={() => handleRetweetTweet(tweet.id)}
              className={`flex items-center space-x-2 group transition-colors ${
                tweet.retweeted ? 'text-green-500' : 'text-gray-500 dark:text-gray-400 hover:text-green-500'
              }`}
              aria-label={tweet.retweeted ? `Undo retweet, ${tweet.retweets} retweets` : `Retweet, ${tweet.retweets} retweets`}
            >
              <div className={`p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors ${
                tweet.retweeted ? 'bg-green-50 dark:bg-green-900/20' : ''
              }`}>
                <Repeat className="h-5 w-5" />
              </div>
              <span className="text-sm">{formatNumber(tweet.retweets)}</span>
            </button>
            
            <button
              onClick={() => handleLikeTweet(tweet.id)}
              className={`flex items-center space-x-2 group transition-colors ${
                tweet.liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
              }`}
              aria-label={tweet.liked ? `Unlike tweet, ${tweet.likes} likes` : `Like tweet, ${tweet.likes} likes`}
            >
              <div className={`p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors ${
                tweet.liked ? 'bg-red-50 dark:bg-red-900/20' : ''
              }`}>
                <Heart className={`h-5 w-5 ${tweet.liked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-sm">{formatNumber(tweet.likes)}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 group transition-colors"
              aria-label="Share tweet"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
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