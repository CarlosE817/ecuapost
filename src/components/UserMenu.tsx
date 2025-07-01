import React, { useState } from 'react';
import { LogOut, User, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface UserMenuProps {
  onProfileClick: () => void;
  onSettingsClick: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onProfileClick, onSettingsClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
      >
        <img
          src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'Usuario')}&background=3b82f6&color=fff`}
          alt={user.displayName || 'Usuario'}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1 text-left">
          <p className="font-bold text-gray-900 dark:text-white truncate">
            {user.displayName || 'Usuario'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
            {user.email || user.phoneNumber}
          </p>
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
            <button
              onClick={() => {
                onProfileClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-white">Ver perfil</span>
            </button>
            
            <button
              onClick={() => {
                onSettingsClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-white">Configuración</span>
            </button>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-white">Centro de ayuda</span>
            </button>
            
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left text-red-600"
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