import React from 'react';
import { Home, Search, Bell, Mail, Bookmark, User, Settings, Megaphone } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
 const menuItems = [
  { icon: Home, label: 'Home', id: 'home' },
  { icon: Search, label: 'Buscar posts', id: 'explore' }, // cambiado
  { icon: Bell, label: 'Notifications', id: 'notifications' },
  { icon: Mail, label: 'Messages', id: 'messages' },
  { icon: Bookmark, label: 'Bookmarks', id: 'bookmarks' },
  { icon: User, label: 'Profile', id: 'profile' },
  { icon: Settings, label: 'Settings', id: 'settings' }
];
 

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Megaphone className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold text-blue-600">EcuaPost</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-full transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-lg font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4">
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors">
          Publicar
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
