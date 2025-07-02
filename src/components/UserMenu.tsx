import React, { useState } from 'react';
import { LogOut, User, Settings, HelpCircle } from 'lucide-react';
// import { useAuth } from '../hooks/useAuth'; // Replaced by useAppContext
import { useAppContext } from '../contexts/AppContext';
import { auth } from '../config/firebase'; // For direct signOut

interface UserMenuProps {
  // onProfileClick and onSettingsClick are no longer needed as props,
  // they will use setActiveTab from context directly.
  // However, Sidebar passes them, so we can keep them for now or refactor Sidebar further.
  // For this step, let's assume Sidebar is also refactored to not pass these if UserMenu handles it.
  // If Sidebar still passes them, UserMenu can choose to use them or context.
  // Let's make UserMenu use context directly for navigation for consistency.
   onProfileClick?: () => void; // Optional if Sidebar still passes them
   onSettingsClick?: () => void; // Optional
}

const UserMenu: React.FC<UserMenuProps> = ( { /* onProfileClick, onSettingsClick */ } ) => {
  const [isOpen, setIsOpen] = useState(false);
  // const { user, signOut: authSignOut } = useAuth(); // Replaced
  const { appUser, setActiveTab, showToast, openAuthModal } = useAppContext();


  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Using direct firebase auth instance
      showToast('Has cerrado sesión exitosamente.', 'success');
      setActiveTab('home'); // Navigate to home or explore after logout
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error";
      showToast(`Error al cerrar sesión: ${errorMessage}`, 'error');
    }
  };

  const handleHelpClick = () => {
    showToast('El centro de ayuda estará disponible pronto.', 'info');
    setIsOpen(false);
  }

  if (!appUser) {
     // This case should ideally not be reached if UserMenu is only shown when user is logged in (as in Sidebar)
     // But as a fallback, can offer login.
    return (
        <button
            onClick={openAuthModal}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
        >
            Iniciar Sesión
        </button>
    );
  }

  const userAvatar = appUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(appUser.displayName || 'Usuario')}&background=3b82f6&color=fff`;
  const userDisplayName = appUser.displayName || 'Usuario';
  // Display username if available, otherwise fallback to email part or generic
  const userHandle = appUser.username || (appUser.firebaseUser?.email?.split('@')[0] || 'usuario');


  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
      >
        <img
          src={userAvatar}
          alt={userDisplayName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 text-left">
          <p className="font-bold text-gray-900 dark:text-white truncate">
            {userDisplayName}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
            @{userHandle}
          </p>
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10 bg-black/10 dark:bg-black/30" // Slight overlay to indicate click-outside closes
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
            <button
              onClick={() => {
                setActiveTab('profile');
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-white">Ver perfil</span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('settings');
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-white">Configuración</span>
            </button>
            
            <button
              onClick={handleHelpClick}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-white">Centro de ayuda</span>
            </button>
            
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left text-red-500 dark:text-red-400"
            >
              <LogOut className="h-5 w-5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;