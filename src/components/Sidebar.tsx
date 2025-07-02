import React from 'react';
import { Home, Search, Bell, Mail, Bookmark, User, Settings, Megaphone, Edit3 } from 'lucide-react';
// import { useAuth } from '../hooks/useAuth'; // Replaced by useAppContext
import { useAppContext } from '../contexts/AppContext';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';

// SidebarProps removed as activeTab and onTabChange come from context
// interface SidebarProps {
//   activeTab: string;
//   onTabChange: (tab: string) => void;
// }

const Sidebar: React.FC = () => {
  const { appUser, activeTab, setActiveTab, openAuthModal, showToast } = useAppContext();
  // const { user } = useAuth(); // appUser from context replaces this

  const menuItems = [
    { icon: Home, label: 'Home', id: 'home', requiresAuth: false },
    { icon: Search, label: 'Buscar posts', id: 'explore', requiresAuth: false },
    { icon: Bell, label: 'Notifications', id: 'notifications', requiresAuth: true },
    { icon: Mail, label: 'Messages', id: 'messages', requiresAuth: true },
    { icon: Bookmark, label: 'Bookmarks', id: 'bookmarks', requiresAuth: true },
    { icon: User, label: 'Profile', id: 'profile', requiresAuth: true },
    { icon: Settings, label: 'Settings', id: 'settings', requiresAuth: false } // Settings might be partially available
  ];

  const handleTabChange = (tabId: string, requiresAuth: boolean) => {
    if (requiresAuth && !appUser) {
      openAuthModal();
      showToast('Debes iniciar sesión para acceder a esta sección.', 'info');
    } else {
      setActiveTab(tabId);
    }
  };

  const handlePublicarClick = () => {
    if (!appUser) {
      openAuthModal();
      showToast('Debes iniciar sesión para publicar.', 'info');
    } else {
      // Future: Open compose modal or navigate to a compose view
      // For now, if on 'home', it will show ComposeBox. If not, maybe switch to home?
      if (activeTab !== 'home') {
        setActiveTab('home');
      }
      // Scroll to ComposeBox or focus it - more advanced UX
      const composeBoxElement = document.querySelector('textarea[placeholder="¿Qué está pasando?"]');
      if (composeBoxElement) {
        (composeBoxElement as HTMLTextAreaElement).focus();
      }
      showToast('Listo para escribir tu tweet.', 'info');
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleTabChange('home', false)}>
            <Megaphone className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">EcuaPost</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      <nav className="flex-1 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = activeTab === item.id;
          // Disable button visually if it requires auth and user is not logged in (though click is handled)
          const isDisabled = item.requiresAuth && !appUser;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id, item.requiresAuth)}
              // disabled={isDisabled} // Let click handler manage behavior for better UX (show modal)
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-full transition-colors ${
                isItemActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                  : `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`
              }`}
            >
              <Icon className={`h-6 w-6 ${isItemActive ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-lg ${isItemActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 space-y-4">
        <button
          onClick={handlePublicarClick}
          className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors flex items-center justify-center space-x-2"
        >
          <Edit3 size={20} />
          <span>Publicar</span>
        </button>
        
        {appUser ? (
          <UserMenu
            onProfileClick={() => handleTabChange('profile', true)}
            onSettingsClick={() => handleTabChange('settings', false)}
            // onLogout will be handled by UserMenu itself using useAuth hook or context
          />
        ) : (
          <button
            onClick={openAuthModal}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;