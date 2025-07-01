import React from 'react';
import { Search, MoreHorizontal } from 'lucide-react';
import { User } from '../types';
import { trendingTopics, suggestedUsers } from '../data/mockData';

const RightSidebar: React.FC = () => {
  return (
    <div className="w-80 p-4 space-y-6">
      <div className="sticky top-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Twitter"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full border-none outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-2xl p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3">What's happening</h2>
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer">
              <div>
                <p className="text-gray-500 text-sm">Trending in Technology</p>
                <p className="font-bold text-gray-900">{topic.tag}</p>
                <p className="text-gray-500 text-sm">{topic.tweets} Tweets</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        <button className="text-blue-500 hover:underline mt-3 text-sm">
          Show more
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-2xl p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Who to follow</h2>
        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-bold text-gray-900">{user.displayName}</p>
                  <p className="text-gray-500 text-sm">@{user.username}</p>
                </div>
              </div>
              <button className="bg-black hover:bg-gray-800 text-white px-4 py-1 rounded-full text-sm font-bold transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
        <button className="text-blue-500 hover:underline mt-3 text-sm">
          Show more
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;