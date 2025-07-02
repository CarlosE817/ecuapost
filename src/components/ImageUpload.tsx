import React, { useState, useRef } from 'react';
import { Image, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (files: File[]) => void;
  selectedImages: File[];
  onRemoveImage: (index: number) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelect, 
  selectedImages, 
  onRemoveImage, 
  maxImages = 4 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) return false;
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) return false;
      
      return true;
    });

    const remainingSlots = maxImages - selectedImages.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);
    
    if (filesToAdd.length > 0) {
      onImageSelect([...selectedImages, ...filesToAdd]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const createImagePreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-3">
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Upload Button */}
      {selectedImages.length < maxImages && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors"
          title="Subir imagen"
        >
          <Image className="h-5 w-5" />
        </button>
      )}

      {/* Drag and Drop Area */}
      {selectedImages.length === 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        >
          <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Arrastra imágenes aquí o{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-500 hover:underline"
            >
              selecciona archivos
            </button>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PNG, JPG, GIF hasta 5MB
          </p>
        </div>
      )}

      {/* Image Previews */}
      {selectedImages.length > 0 && (
        <div className={`grid gap-2 ${
          selectedImages.length === 1 ? 'grid-cols-1' :
          selectedImages.length === 2 ? 'grid-cols-2' :
          'grid-cols-2'
        }`}>
          {selectedImages.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={createImagePreview(file)}
                alt={`Preview ${index + 1}`}
                className={`w-full object-cover rounded-lg ${
                  selectedImages.length === 1 ? 'h-64' :
                  selectedImages.length === 2 ? 'h-48' :
                  'h-32'
                }`}
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                {(file.size / 1024 / 1024).toFixed(1)}MB
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress/Info */}
      {selectedImages.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {selectedImages.length} de {maxImages} imágenes seleccionadas
        </div>
      )}
    </div>
  );
};

export default ImageUpload;