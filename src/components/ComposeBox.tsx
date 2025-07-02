import React, { useState } from 'react';
import { Smile, Calendar, MapPin } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const ComposeBox: React.FC = () => {
  const { appUser, handleNewPost, showToast } = useAppContext(); // Usar handleNewPost
  const [content, setContent] = useState('');
  const maxLength = 280;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appUser) {
      showToast('Debes iniciar sesión para publicar.', 'error');
      return;
    }
    if (content.trim()) {
      if (content.length <= maxLength) {
        await handleNewPost(content); // Llamar a handleNewPost solo con contenido
        setContent('');
      } else {
        showToast(`El post no puede exceder los ${maxLength} caracteres.`, 'error');
      }
    } else {
      showToast('El post no puede estar vacío.', 'info');
    }
  };

  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;
  const isNearLimit = remainingChars <= 20 && remainingChars >=0;

  const userAvatar = appUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(appUser?.displayName || 'U')}&background=3b82f6&color=fff`;
  const userName = appUser?.displayName || 'Usuario';
  // Solo se puede enviar si hay contenido y no se excede el límite y el usuario está logueado
  const canSubmit = content.trim() && !isOverLimit && appUser != null;


  return (
    <div className="border-b border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <img
            src={userAvatar}
            alt={userName}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={appUser ? "¿Qué está pasando?" : "Inicia sesión para publicar"}
              className="w-full text-xl placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none resize-none bg-transparent text-gray-900 dark:text-white"
              rows={3}
              disabled={!appUser}
            />
            
            {/* Sección de ImageUpload eliminada */}
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                {/* Botones de Smile, Calendar, MapPin mantenidos pero sin funcionalidad de imagen */}
                <button
                  type="button"
                  disabled={!appUser}
                  className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors disabled:opacity-50"
                  aria-label="Add emoji"
                >
                  <Smile className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  disabled={!appUser}
                  className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors disabled:opacity-50"
                  aria-label="Schedule tweet"
                >
                  <Calendar className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  disabled={!appUser}
                  className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors disabled:opacity-50"
                  aria-label="Add location"
                >
                  <MapPin className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                {appUser && (content.length > 0 || isOverLimit) && ( // Show only if typing or over limit
                  <>
                    <div className={`text-sm ${isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      {remainingChars}
                    </div>
                    <div className="w-8 h-8 relative">
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          fill="none"
                          stroke={isOverLimit ? '#ef4444' : isNearLimit ? '#f59e0b' : (document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb')} // Adjust for dark mode
                          strokeWidth="2"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          fill="none"
                          stroke={isOverLimit ? '#ef4444' : isNearLimit ? '#f59e0b' : '#1da1f2'}
                          strokeWidth="2"
                          strokeDasharray={`${75.4 * Math.min(content.length / maxLength, 1)} 75.4`}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </>
                )}
                
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`px-6 py-2 rounded-full font-bold transition-colors ${
                    !canSubmit
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
                  }`}
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ComposeBox;