import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';
import RightSidebar from './components/RightSidebar';
import { tweets as initialTweets, currentUser } from './data/mockData';
import { Tweet } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [tweets, setTweets] = useState<Tweet[]>(initialTweets);

  const handleNewTweet = useCallback((content: string) => {
    const newTweet: Tweet = {
      id: Date.now().toString(),
      user: currentUser,
      content,
      timestamp: new Date(),
      likes: 0,
      retweets: 0,
      replies: 0,
      liked: false,
      retweeted: false
    };
    setTweets(prev => [newTweet, ...prev]);
  }, []);

  const handleLike = useCallback((tweetId: string) => {
    setTweets(prev => prev.map(tweet => 
      tweet.id === tweetId 
        ? { 
            ...tweet, 
            liked: !tweet.liked,
            likes: tweet.liked ? tweet.likes - 1 : tweet.likes + 1
          }
        : tweet
    ));
  }, []);

  const handleRetweet = useCallback((tweetId: string) => {
    setTweets(prev => prev.map(tweet => 
      tweet.id === tweetId 
        ? { 
            ...tweet, 
            retweeted: !tweet.retweeted,
            retweets: tweet.retweeted ? tweet.retweets - 1 : tweet.retweets + 1
          }
        : tweet
    ));
  }, []);

  const handleReply = useCallback((tweetId: string) => {
    console.log('Reply to tweet:', tweetId);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 ml-64">
          <div className="flex">
            <div className="flex-1 max-w-2xl">
              <Timeline
                tweets={tweets}
                onTweet={handleNewTweet}
                onLike={handleLike}
                onRetweet={handleRetweet}
                onReply={handleReply}
              />
            </div>
            
            <div className="hidden lg:block">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;