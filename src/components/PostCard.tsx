import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Repeat, Share, MoreHorizontal, BadgeCheck, Trash2, Edit3 } from 'lucide-react';
import { PostData } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface PostCardProps {
  post: PostData;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    appUser,
    showToast,
    handleEditPost,
    handleDeletePost,
  } = useAppContext();

  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.contenido);

  useEffect(() => {
    setEditContent(post.contenido);
  }, [post.contenido]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
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

  // Verificar si el post pertenece al usuario logueado
  const isOwnPost = appUser && post.user_id === appUser.id;

  const handleSaveChanges = async () => {
    if (editContent.trim() && editContent !== post.contenido) {
      await handleEditPost(post.id, editContent.trim());
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const confirmAndDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      await handleDeletePost(post.id);
    }
    setShowMenu(false);
  };

  // Información del autor del post
  const authorDisplayName = post.displayName || post.username;
  const authorAvatar = post.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.username)}&background=random`;

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors bg-white dark:bg-gray-900">
      <div className="flex space-x-3">
        <img
          src={authorAvatar}
          alt={authorDisplayName}
          className="w-12 h-12 rounded-full"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-gray-900 dark:text-white truncate">{authorDisplayName}</h3>
            <span className="text-gray-500 dark:text-gray-400 truncate">@{post.username}</span>
            <span className="text-gray-500 dark:text-gray-400">·</span>
            <span className="text-gray-500 dark:text-gray-400">{formatTime(post.fecha)}</span>
            <div className="ml-auto relative">
              {isOwnPost && (
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              )}

              {showMenu && isOwnPost && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditContent(post.contenido);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-900 dark:text-white"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Editar post</span>
                  </button>

                  <button
                    onClick={confirmAndDelete}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Eliminar post</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-2">
            {isEditing && isOwnPost ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows={3}
                  maxLength={280}
                  aria-label="Edit post content"
                />
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${editContent.length > 280 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {editContent.length}/280
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditContent(post.contenido);
                      }}
                      className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      disabled={!editContent.trim() || editContent.trim() === post.contenido || editContent.length > 280}
                      className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-900 dark:text-white text-base leading-relaxed">{post.contenido}</p>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 max-w-md">
            <button
              onClick={() => showToast('Comentarios próximamente...', 'info')}
              className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 group transition-colors"
              aria-label={`Reply to post, ${post.comments_count || 0} replies`}
            >
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </div>
              <span className="text-sm">{formatNumber(post.comments_count || 0)}</span>
            </button>

            <button
              onClick={() => showToast('Retweets próximamente...', 'info')}
              className="flex items-center space-x-2 group transition-colors text-gray-500 dark:text-gray-400 hover:text-green-500"
            >
              <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                <Repeat className="h-5 w-5" />
              </div>
            </button>

            <button
              onClick={() => showToast('Likes próximamente...', 'info')}
              className="flex items-center space-x-2 group transition-colors text-gray-500 dark:text-gray-400 hover:text-red-500"
            >
              <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                <Heart className="h-5 w-5" />
              </div>
              <span className="text-sm">{formatNumber(post.likes_count || 0)}</span>
            </button>

            <button
              onClick={() => showToast('Compartir próximamente...', 'info')}
              className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 group transition-colors"
              aria-label="Share post"
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

export default PostCard;