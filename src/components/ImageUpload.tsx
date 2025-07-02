import React, { useState, useRef, useEffect } from 'react';
import { Image, X, Upload } from 'lucide-react';

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
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Create image previews when selectedImages change
  useEffect(() => {
    const previews = selectedImages.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);

    // Cleanup previous URLs to prevent memory leaks
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedImages]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.warn('Archivo no válido (no es imagen):', file.name);
        return false;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.warn('Archivo muy grande (>5MB):', file.name);
        return false;
      }
      
      return true;
    });

    const remainingSlots = maxImages - selectedImages.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);
    
    if (filesToAdd.length > 0) {
      console.log('📸 Agregando imágenes:', filesToAdd.length);
      onImageSelect([...selectedImages, ...filesToAdd]);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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

      {/* Drag and Drop Area - Only show when no images selected */}
      {selectedImages.length === 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className={`h-8 w-8 ${dragOver ? 'text-blue-500' : 'text-gray-400'} transition-colors`} />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                {dragOver ? 'Suelta las imágenes aquí' : 'Arrastra imágenes o haz clic para seleccionar'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                PNG, JPG, GIF hasta 5MB • Máximo {maxImages} imágenes
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add More Images Button - Show when there are images but not at max */}
      {selectedImages.length > 0 && selectedImages.length < maxImages && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <Image className="h-4 w-4" />
          <span>Agregar más imágenes ({selectedImages.length}/{maxImages})</span>
        </button>
      )}

      {/* Image Previews */}
      {selectedImages.length > 0 && (
        <div className="space-y-3">
          <div className={`grid gap-2 ${
            selectedImages.length === 1 ? 'grid-cols-1' :
            selectedImages.length === 2 ? 'grid-cols-2' :
            selectedImages.length === 3 ? 'grid-cols-3' :
            'grid-cols-2'
          }`}>
            {selectedImages.map((file, index) => (
              <div key={`${file.name}-${index}`} className="relative group">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  <img
                    src={imagePreviews[index]}
                    alt={`Preview ${index + 1}`}
                    className={`w-full object-cover transition-transform group-hover:scale-105 ${
                      selectedImages.length === 1 ? 'h-64' :
                      selectedImages.length === 2 ? 'h-48' :
                      selectedImages.length === 3 ? 'h-32' :
                      'h-32'
                    }`}
                  />
                  
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                    title="Eliminar imagen"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  
                  {/* File info */}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                    {formatFileSize(file.size)}
                  </div>
                  
                  {/* File name tooltip */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity max-w-32 truncate">
                    {file.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
            <span>
              {selectedImages.length} imagen{selectedImages.length !== 1 ? 'es' : ''} seleccionada{selectedImages.length !== 1 ? 's' : ''}
            </span>
            <span>
              {formatFileSize(selectedImages.reduce((total, file) => total + file.size, 0))} total
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;