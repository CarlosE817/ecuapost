import React, { useState } from 'react';
import { Smile, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ImageUpload from './ImageUpload';

interface ComposeBoxProps {
  onTweet: (content: string, images?: File[]) => void;
}

const ComposeBox: React.FC<ComposeBoxProps> = ({ onTweet }) => {
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { user } = useAuth();
  const maxLength = 280;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && content.length <= maxLength) {
      onTweet(content, selectedImages);
      setContent('');
      setSelectedImages([]);
    }
  };

  const handleImageSelect = (images: File[]) => {
    setSelectedImages(images);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;
  const isNearLimit = remainingChars <= 20;

  const userAvatar = user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'Usuario')}&background=3b82f6&color=fff`;
  const userName = user?.displayName || 'Usuario';

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
              placeholder="¿Qué está pasando?"
              className="w-full text-xl placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none resize-none bg-transparent text-gray-900 dark:text-white"
              rows={3}
            />
            
            {/* Image Upload Component */}
            <div className="mt-3">
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImages={selectedImages}
                onRemoveImage={handleRemoveImage}
                maxImages={4}
              />
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors"
                >
                  <Smile className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors"
                >
                  <Calendar className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors"
                >
                  <MapPin className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
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
                        stroke={isOverLimit ? '#ef4444' : isNearLimit ? '#f59e0b' : '#e5e7eb'}
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
                </div>
                
                <button
                  type="submit"
                  disabled={!content.trim() || isOverLimit}
                  className={`px-6 py-2 rounded-full font-bold transition-colors ${
                    !content.trim() || isOverLimit
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