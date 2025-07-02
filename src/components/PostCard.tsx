import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Repeat, Share, MoreHorizontal, BadgeCheck, Trash2, Edit3 } from 'lucide-react'; // Bookmark removido temporalmente
import { PostData } from '../types'; // Usar PostData
import { useAppContext } from '../contexts/AppContext';

interface PostCardProps { // Renombrar interface
  post: PostData; // Usar post y PostData
}

const PostCard: React.FC<PostCardProps> = ({ post }) => { // Renombrar componente y prop
  const {
    appUser, // para verificar si es el post del propio usuario
    showToast,
    // Las funciones de like, retweet, etc., están comentadas en AppContext, así que no se desestructuran aquí por ahora
    // handleLikePost,
    // handleRetweetPost,
    // handleReplyPost,
    // handleDeletePost,
    // handleEditPost,
    // isPostBookmarked, // Comentado también
  } = useAppContext();

  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.contenido); // Usar post.contenido

  useEffect(() => {
    setEditContent(post.contenido);
  }, [post.contenido]);

  // const isBookmarked = isPostBookmarked(post.id); // Comentado

  const formatTime = (dateString: string) => { // Recibe string de fecha
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

  const handleSaveChanges = () => {
    // if (handleEditPost && editContent.trim() && editContent !== post.contenido) {
    //   handleEditPost(post.id, editContent.trim());
    // }
    // setIsEditing(false);
    // setShowMenu(false);
    showToast('Edición de posts próximamente...', 'info');
  };

  const confirmAndDelete = () => {
    // if (handleDeletePost && window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
    //   handleDeletePost(post.id);
    // }
    // setShowMenu(false);
    showToast('Eliminación de posts próximamente...', 'info');
  };

  // renderImages eliminado

  // Información del autor del post
  const authorDisplayName = post.displayName || post.username;
  const authorAvatar = post.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.username)}&background=random`;
  // const authorVerified = post.verified; // Asumiendo que 'verified' podría venir del backend para el autor del post

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
            {/* {authorVerified && ( // Si tuviéramos 'verified' para el autor del post
              <BadgeCheck className="h-5 w-5 text-blue-500" />
            )} */}
            <span className="text-gray-500 dark:text-gray-400 truncate">@{post.username}</span>
            <span className="text-gray-500 dark:text-gray-400">·</span>
            <span className="text-gray-500 dark:text-gray-400">{formatTime(post.fecha)}</span>
            <div className="ml-auto relative">
              {isOwnPost && ( // Solo mostrar menú si es el post del usuario
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
                  {/* Bookmark Button Comentado */}
                  {/* <button
                    onClick={() => {
                      // handleBookmarkPost(post.id);
                      setShowMenu(false);
                      showToast('Bookmark próximamente...', 'info');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-900 dark:text-white"
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current text-blue-500' : ''}`} />
                    <span>{isBookmarked ? 'Quitar bookmark' : 'Guardar post'}</span>
                  </button> */}

                  {/* {isOwnPost && handleEditPost && ( // Reemplazado por showToast temporal */}
                  <button
                    onClick={() => {
                      // setIsEditing(true);
                      // setEditContent(post.contenido);
                      // setShowMenu(false);
                      showToast('Edición de posts próximamente...', 'info');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-900 dark:text-white"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Editar post</span>
                  </button>
                  {/* )} */}

                  {/* {isOwnPost && handleDeletePost && ( // Reemplazado por showToast temporal */}
                  <button
                    onClick={confirmAndDelete}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Eliminar post</span>
                  </button>
                  {/* )} */}
                </div>
              )}
            </div>
          </div>

          <div className="mt-2">
            {isEditing && isOwnPost ? ( // Solo permitir edición si es propio
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows={3}
                  maxLength={280}
                  aria-label="Edit post content"
                />
                <div className="flex justify-end space-x-2">
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
                    disabled={!editContent.trim() || editContent.trim() === post.contenido}
                    className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-900 dark:text-white text-base leading-relaxed">{post.contenido}</p>
            )}

            {/* renderImages() eliminado */}
          </div>

          {/* Botones de acción comentados temporalmente */}
          <div className="flex items-center justify-between mt-4 max-w-md">
            <button
              // onClick={() => handleReplyPost(post.id)}
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
              // onClick={() => handleRetweetPost(post.id)}
              onClick={() => showToast('Retweets próximamente...', 'info')}
              className={`flex items-center space-x-2 group transition-colors text-gray-500 dark:text-gray-400 hover:text-green-500`}
              // aria-label={post.retweeted ? `Undo retweet, ${post.retweets_count || 0} retweets` : `Retweet, ${post.retweets_count || 0} retweets`}
            >
              <div className={`p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors`}>
                <Repeat className="h-5 w-5" />
              </div>
              {/* <span className="text-sm">{formatNumber(post.retweets_count || 0)}</span> */}
            </button>

            <button
              // onClick={() => handleLikePost(post.id)}
              onClick={() => showToast('Likes próximamente...', 'info')}
              className={`flex items-center space-x-2 group transition-colors text-gray-500 dark:text-gray-400 hover:text-red-500`}
              // aria-label={post.liked ? `Unlike post, ${post.likes_count || 0} likes` : `Like post, ${post.likes_count || 0} likes`}
            >
              <div className={`p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors`}>
                <Heart className={`h-5 w-5`} />
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