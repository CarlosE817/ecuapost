import React from 'react';
import { Heart, Repeat, MessageCircle, UserPlus, Settings } from 'lucide-react';

const Notifications: React.FC = () => {
  const notifications = [
    {
      id: '1',
      type: 'like',
      user: {
        name: 'Sarah Johnson',
        username: 'sarah_tech',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      content: 'le gustó tu tweet',
      tweet: 'Coffee shops are the unsung heroes of remote work...',
      timestamp: '2h',
      read: false
    },
    {
      id: '2',
      type: 'retweet',
      user: {
        name: 'Mike Chen',
        username: 'mike_dev',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      content: 'retuiteó tu tweet',
      tweet: 'Coffee shops are the unsung heroes of remote work...',
      timestamp: '4h',
      read: false
    },
    {
      id: '3',
      type: 'follow',
      user: {
        name: 'Emma Wilson',
        username: 'emma_design',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      content: 'te siguió',
      timestamp: '1d',
      read: true
    },
    {
      id: '4',
      type: 'reply',
      user: {
        name: 'Alex Rodriguez',
        username: 'alex_code',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      content: 'respondió a tu tweet',
      tweet: 'Totalmente de acuerdo! Los espacios de coworking también son geniales.',
      timestamp: '2d',
      read: true
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-6 w-6 text-red-500 fill-current" />;
      case 'retweet':
        return <Repeat className="h-6 w-6 text-green-500" />;
      case 'reply':
        return <MessageCircle className="h-6 w-6 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-6 w-6 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="border-l border-r border-gray-200 min-h-screen">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Notificaciones</h1>
          <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <div className="flex">
          <button className="flex-1 py-4 text-center font-bold text-gray-900 border-b-2 border-blue-500">
            Todas
          </button>
          <button className="flex-1 py-4 text-center text-gray-500 hover:bg-gray-50 transition-colors">
            Menciones
          </button>
        </div>
      </div>
      
      <div>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <img
                    src={notification.user.avatar}
                    alt={notification.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <span className="font-bold">{notification.user.name}</span>
                      <span className="text-gray-500 ml-1">@{notification.user.username}</span>
                      <span className="ml-1">{notification.content}</span>
                      <span className="text-gray-500 ml-2">{notification.timestamp}</span>
                    </p>
                    {notification.tweet && (
                      <p className="text-gray-600 text-sm mt-1 bg-gray-100 p-2 rounded">
                        {notification.tweet}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;