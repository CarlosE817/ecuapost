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
import AuthModal from './components/AuthModal';
import { tweets as initialTweets } from './data/mockData';
import { Tweet, User } from './types';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [bookmarkedTweets, setBookmarkedTweets] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, loading } = useAuth();

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

  // Show auth modal if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [user, loading]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getCurrentUser = (): User => {
    if (user) {
      return {
        id: user.uid,
        username: user.email?.split('@')[0] || 'usuario',
        displayName: user.displayName || 'Usuario',
        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'Usuario')}&background=3b82f6&color=fff`,
        bio: 'Usuario de EcuaPost',
        followers: 0,
        following: 0,
        verified: false
      };
    }
    
    // Fallback user for demo purposes
    return {
      id: 'demo',
      username: 'demo_user',
      displayName: 'Usuario Demo',
      avatar: 'https://ui-avatars.com/api/?name=Demo&background=3b82f6&color=fff',
      bio: 'Usuario demo de EcuaPost',
      followers: 0,
      following: 0,
      verified: false
    };
  };

  const convertFilesToUrls = (files: File[]): Promise<string[]> => {
    return Promise.all(
      files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      })
    );
  };

  const handleNewTweet = useCallback(async (content: string, images?: File[]) => {
    const currentUser = getCurrentUser();
    
    let imageUrls: string[] = [];
    if (images && images.length > 0) {
      imageUrls = await convertFilesToUrls(images);
    }

    const newTweet: Tweet = {
      id: Date.now().toString(),
      user: currentUser,
      content,
      timestamp: new Date(),
      likes: 0,
      retweets: 0,
      replies: 0,
      liked: false,
      retweeted: false,
      images: imageUrls.length > 0 ? imageUrls : undefined
    };
    
    setTweets(prev => [newTweet, ...prev]);
    showToast(
      images && images.length > 0 
        ? `¡Tweet con ${images.length} imagen${images.length > 1 ? 'es' : ''} publicado!`
        : '¡Tweet publicado exitosamente!', 
      'success'
    );
  }, [user]);

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

  const handleAuthSuccess = () => {
    showToast('¡Bienvenido a EcuaPost!', 'success');
  };

  const renderContent = () => {
    const currentUser = getCurrentUser();
    const userTweets = tweets.filter(tweet => tweet.user.id === currentUser.id);

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
        return <Profile user={currentUser} tweets={userTweets} onLike={handleLike} onRetweet={handleRetweet} onReply={handleReply} onBookmark={handleBookmark} onDelete={handleDeleteTweet} onEdit={handleEditTweet} bookmarkedTweets={bookmarkedTweets} />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando EcuaPost...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
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

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;