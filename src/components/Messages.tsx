import React from 'react';
import { Search, Settings, Mail } from 'lucide-react';

const Messages: React.FC = () => {
  const conversations = [
    {
      id: '1',
      user: {
        name: 'Sarah Johnson',
        username: 'sarah_tech',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      lastMessage: 'Hola! ¿Cómo va el proyecto?',
      timestamp: '2h',
      unread: true
    },
    {
      id: '2',
      user: {
        name: 'Mike Chen',
        username: 'mike_dev',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      lastMessage: 'Perfecto, nos vemos mañana',
      timestamp: '1d',
      unread: false
    },
    {
      id: '3',
      user: {
        name: 'Emma Wilson',
        username: 'emma_design',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      lastMessage: 'Gracias por la ayuda con el diseño',
      timestamp: '3d',
      unread: false
    }
  ];

  return (
    <div className="border-l border-r border-gray-200 min-h-screen">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Mensajes</h1>
          <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar mensajes"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full border-none outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>
      </div>
      
      <div>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
          >
            <img
              src={conversation.user.avatar}
              alt={conversation.user.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-gray-900 truncate">{conversation.user.name}</h3>
                  <span className="text-gray-500 text-sm">@{conversation.user.username}</span>
                </div>
                <span className="text-gray-500 text-sm">{conversation.timestamp}</span>
              </div>
              <p className={`text-sm truncate ${conversation.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {conversation.lastMessage}
              </p>
            </div>
            {conversation.unread && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
      
      {conversations.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <Mail className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-bold mb-2">No tienes mensajes</p>
          <p>Cuando alguien te envíe un mensaje, aparecerá aquí.</p>
        </div>
      )}
    </div>
  );
};

export default Messages;