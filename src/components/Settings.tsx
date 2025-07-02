import React, { useState, useRef, useEffect } from 'react';
import { User, Bell, Shield, Palette, Globe, HelpCircle, LogOut, Moon, Sun, UploadCloud, Camera, Edit2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAppContext } from '../contexts/AppContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const {
    appUser,
    showToast,
    firebaseUser,
    updateUserProfilePicture, // Desde AppContext
    loadingProfileUpdate // Desde AppContext
  } = useAppContext();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (appUser?.avatar) {
      setPreviewUrl(appUser.avatar);
    }
  }, [appUser?.avatar]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !firebaseUser) {
      showToast('Por favor, selecciona un archivo.', 'error');
      return;
    }
    if (!firebaseUser.uid) {
        showToast('Error: UID de usuario no encontrado.', 'error');
        return;
    }

    showToast('Subiendo foto de perfil...', 'info');
    const newPhotoURL = await updateUserProfilePicture(firebaseUser.uid, selectedFile);
    if (newPhotoURL) {
      showToast('¡Foto de perfil actualizada!', 'success');
      // El appUser en AppContext se actualizará a través de onAuthStateChanged o la actualización manual en useAuth
      // y el previewUrl ya se actualizó localmente.
      // Si la actualización en useAuth no refresca appUser inmediatamente, necesitaríamos un método para refrescar AppContext.
    } else {
      showToast('Error al actualizar la foto de perfil.', 'error');
      // Revertir preview si falla la subida, o dejar que el usuario reintente.
      // setPreviewUrl(appUser?.avatar || null); // Opcional: revertir
    }
    setSelectedFile(null); // Limpiar selección después del intento
  };

  const settingsGroups = [
    {
      title: 'Tu cuenta',
      items: [
        // Nuevo ítem para cambiar foto de perfil (se renderizará de forma especial)
        // { icon: Camera, label: 'Foto de perfil', description: 'Cambiar tu foto de perfil', isProfilePhotoChanger: true },
        { icon: User, label: 'Información de la cuenta', description: 'Ver tu información de cuenta' },
        { icon: Shield, label: 'Privacidad y seguridad', description: 'Controla tu privacidad' },
        { icon: Bell, label: 'Notificaciones', description: 'Selecciona las notificaciones que recibes' }
      ]
    },
    {
      title: 'Personalización',
      items: [
        { 
          icon: isDark ? Moon : Sun, 
          label: 'Tema', 
          description: `Modo ${isDark ? 'oscuro' : 'claro'} activado`,
          action: toggleTheme,
          isThemeToggle: true
        },
        { icon: Palette, label: 'Pantalla', description: 'Gestiona tu tamaño de fuente, color y fondo' },
        { icon: Globe, label: 'Idioma', description: 'Cambia el idioma de la interfaz' }
      ]
    },
    {
      title: 'Ayuda',
      items: [
        { icon: HelpCircle, label: 'Centro de ayuda', description: 'Obtén ayuda usando EcuaPost' }
      ]
    }
  ];

  return (
    <div className="border-l border-r border-gray-200 dark:border-gray-800 min-h-screen bg-white dark:bg-gray-900">
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Configuración</h1>
      </div>
      
      <div className="p-4">
        {appUser && (
          <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Foto de Perfil</h2>
            <div className="flex items-center space-x-4">
              <img
                src={previewUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(appUser.displayName || 'U')}&background=3b82f6&color=fff`}
                alt="Avatar actual"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                  id="profilePictureInput"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors flex items-center space-x-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>{selectedFile ? 'Cambiar imagen' : 'Seleccionar imagen'}</span>
                </button>
                {selectedFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Archivo: <span className="font-medium">{selectedFile.name}</span>
                    </p>
                    <button
                      onClick={handleUpload}
                      disabled={loadingProfileUpdate}
                      className="mt-2 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                      {loadingProfileUpdate ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <UploadCloud className="w-4 h-4" />
                      )}
                      <span>{loadingProfileUpdate ? 'Subiendo...' : 'Guardar foto'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{group.title}</h2>
            <div className="space-y-2">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    onClick={item.action}
                    className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left group"
                  >
                    <Icon className={`h-6 w-6 text-gray-600 dark:text-gray-400 ${item.isThemeToggle ? 'group-hover:text-blue-500' : ''}`} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                    {item.isThemeToggle && (
                      <div className="flex items-center space-x-2">
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isDark ? 'bg-blue-500' : 'bg-gray-300'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <button className="w-full flex items-center space-x-3 p-4 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left text-red-600">
            <LogOut className="h-6 w-6" />
            <div>
              <p className="font-medium">Cerrar sesión</p>
              <p className="text-sm text-red-500">Salir de tu cuenta</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;