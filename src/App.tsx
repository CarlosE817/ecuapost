import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';
import RightSidebar from './components/RightSidebar';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Bookmarks from './components/Bookmarks';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Explore from './components/Explore';
import Toast from './components/Toast';
import { tweets as initialTweets, currentUser } from './data/mockData';
import { Tweet } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [bookmarkedTweets, setBookmarkedTweets] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTweets = localStorage.getItem('ecuapost-tweets');
    const savedBookmarks = localStorage.getItem('ecuapost-bookmarks');
    
    if (savedTweets) {
      try {
        const parsedTweets = JSON.parse(savedTweets).map((tweet: any) => ({
          ...tweet,
          timestamp: new Date(tweet.timestamp)
        }));
        setTweets(parsedTweets);
      } catch (error) {
        console.error('Error loading tweets from localStorage:', error);
        setTweets(initialTweets);
      }
    } else {
      setTweets(initialTweets);
    }

    if (savedBookmarks) {
      try {
        setBookmarkedTweets(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error('Error loading bookmarks from localStorage:', error);
      }
    }
  }, []);

  // Save tweets to localStorage whenever tweets change
  useEffect(() => {
    localStorage.setItem('ecuapost-tweets', JSON.stringify(tweets));
  }, [tweets]);

  // Save bookmarks to localStorage whenever bookmarks change
  useEffect(() => {
    localStorage.setItem('ecuapost-bookmarks', JSON.stringify(bookmarkedTweets));
  }, [bookmarkedTweets]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
    showToast('¡Tweet publicado exitosamente!', 'success');
  }, []);

  const handleLike = useCallback((tweetId: string) => {
    setTweets(prev => prev.map(tweet => {
      if (tweet.id === tweetId) {
        const wasLiked = tweet.liked;
        showToast(wasLiked ? 'Like removido' : '¡Te gusta este tweet!', 'info');
        return {
          ...tweet, 
          liked: !tweet.liked,
          likes: tweet.liked ? tweet.likes - 1 : tweet.likes + 1
        };
      }
      return tweet;
    }));
  }, []);

  const handleRetweet = useCallback((tweetId: string) => {
    setTweets(prev => prev.map(tweet => {
      if (tweet.id === tweetId) {
        const wasRetweeted = tweet.retweeted;
        showToast(wasRetweeted ? 'Retweet removido' : '¡Tweet compartido!', 'info');
        return {
          ...tweet, 
          retweeted: !tweet.retweeted,
          retweets: tweet.retweeted ? tweet.retweets - 1 : tweet.retweets + 1
        };
      }
      return tweet;
    }));
  }, []);

  const handleReply = useCallback((tweetId: string) => {
    showToast('Función de respuesta próximamente...', 'info');
  }, []);

  const handleBookmark = useCallback((tweetId: string) => {
    setBookmarkedTweets(prev => {
      const isBookmarked = prev.includes(tweetId);
      showToast(isBookmarked ? 'Bookmark removido' : '¡Tweet guardado!', 'info');
      return isBookmarked 
        ? prev.filter(id => id !== tweetId)
        : [...prev, tweetId];
    });
  }, []);

  const handleDeleteTweet = useCallback((tweetId: string) => {
    setTweets(prev => prev.filter(tweet => tweet.id !== tweetId));
    setBookmarkedTweets(prev => prev.filter(id => id !== tweetId));
    showToast('Tweet eliminado', 'success');
  }, []);

  const handleEditTweet = useCallback((tweetId: string, newContent: string) => {
    setTweets(prev => prev.map(tweet => 
      tweet.id === tweetId 
        ? { ...tweet, content: newContent }
        : tweet
    ));
    showToast('Tweet editado exitosamente', 'success');
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Timeline
            tweets={tweets}
            onTweet={handleNewTweet}
            onLike={handleLike}
            onRetweet={handleRetweet}
            onReply={handleReply}
            onBookmark={handleBookmark}
            onDelete={handleDeleteTweet}
            onEdit={handleEditTweet}
            bookmarkedTweets={bookmarkedTweets}
          />
        );
      case 'explore':
        return <Explore tweets={tweets} onLike={handleLike} onRetweet={handleRetweet} onReply={handleReply} onBookmark={handleBookmark} bookmarkedTweets={bookmarkedTweets} />;
      case 'notifications':
        return <Notifications />;
      case 'messages':
        return <Messages />;
      case 'bookmarks':
        return <Bookmarks tweets={tweets.filter(tweet => bookmarkedTweets.includes(tweet.id))} onLike={handleLike} onRetweet={handleRetweet} onReply={handleReply} onBookmark={handleBookmark} bookmarkedTweets={bookmarkedTweets} />;
      case 'profile':
        return <Profile user={currentUser} tweets={tweets.filter(tweet => tweet.user.id === currentUser.id)} onLike={handleLike} onRetweet={handleRetweet} onReply={handleReply} onBookmark={handleBookmark} onDelete={handleDeleteTweet} onEdit={handleEditTweet} bookmarkedTweets={bookmarkedTweets} />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <Timeline
            tweets={tweets}
            onTweet={handleNewTweet}
            onLike={handleLike}
            onRetweet={handleRetweet}
            onReply={handleReply}
            onBookmark={handleBookmark}
            onDelete={handleDeleteTweet}
            onEdit={handleEditTweet}
            bookmarkedTweets={bookmarkedTweets}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 ml-64">
          <div className="flex">
            <div className="flex-1 max-w-2xl">
              {renderContent()}
            </div>
            
            <div className="hidden lg:block">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;