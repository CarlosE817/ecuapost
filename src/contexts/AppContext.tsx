// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Tweet, User } from '../types';
import { useAuth } from '../hooks/useAuth'; // Assuming useAuth provides the Firebase user object
import { useTweets } from '../hooks/useTweets';
import { useBookmarks } from '../hooks/useBookmarks';

interface AppContextType {
  // User session
  currentUser: User | null; // The app's User type, not FirebaseUser
  firebaseUser: any; // Raw Firebase user object, for flexibility
  loadingAuth: boolean;
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  handleAuthSuccess: () => void;

  // Tweets
  tweets: Tweet[];
  handleNewTweet: (content: string, images?: File[]) => Promise<void>;
  handleLikeTweet: (tweetId: string) => void;
  handleRetweetTweet: (tweetId: string) => void;
  handleReplyTweet: (tweetId: string) => void;
  handleDeleteTweet: (tweetId: string) => void;
  handleEditTweet: (tweetId: string, newContent: string) => void;

  // Bookmarks
  bookmarkedTweets: string[];
  handleBookmarkTweet: (tweetId: string) => void;
  isTweetBookmarked: (tweetId: string) => boolean;

  // Toast notifications
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Active Tab for navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Current User Profile (derived from firebaseUser)
  appUser: User | null;

  // Profile update
  updateUserProfilePicture: (userId: string, file: File) => Promise<string | null>;
  loadingProfileUpdate: boolean; // Specific loading state for this operation
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    user: firebaseUser,
    loading: loadingAuth, // This is general auth loading (initial load, sign-in, etc.)
    updateUserProfilePicture, // Function from useAuth
    error: authError // We might need to expose authError too
  } = useAuth();

  // Specific loading state for profile picture update, separate from general loadingAuth
  const [loadingProfileUpdate, setLoadingProfileUpdate] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null); // For internal toast state
  const [activeTab, setActiveTab] = useState('home');

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    // This function will be passed to hooks and components, but App.tsx will render the Toast component
    setToastInfo({ message, type });
    // Logic to clear toastInfo will be in App.tsx or a dedicated ToastProvider
  };

  const {
    tweets,
    handleNewTweet,
    handleLike,
    handleRetweet,
    handleReply,
    handleDeleteTweet,
    handleEditTweet,
  } = useTweets(firebaseUser, showToast);

  const { bookmarkedTweets, handleBookmark } = useBookmarks(showToast);

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  const handleAuthSuccess = () => {
    showToast('¡Bienvenido a EcuaPost!', 'success');
    closeAuthModal();
  };

  const appUser = firebaseUser ? {
    id: firebaseUser.uid,
    username: firebaseUser.email?.split('@')[0] || firebaseUser.displayName?.toLowerCase().replace(/\s+/g, '_') || 'usuario',
    displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
    avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario')}&background=3b82f6&color=fff`,
    bio: 'Usuario de EcuaPost', // Default bio
    followers: 0, // Default values
    following: 0,
    verified: firebaseUser.emailVerified || false, // Example: use emailVerified
  } : null;


  const contextValue: AppContextType = {
    currentUser: appUser, // Use the derived appUser here
    firebaseUser,
    loadingAuth,
    showAuthModal,
    openAuthModal,
    closeAuthModal,
    handleAuthSuccess,
    tweets,
    handleNewTweet,
    handleLikeTweet: handleLike,
    handleRetweetTweet: handleRetweet,
    handleReplyTweet: handleReply,
    handleDeleteTweet: handleDeleteTweet,
    handleEditTweet: handleEditTweet,
    bookmarkedTweets,
    handleBookmarkTweet: handleBookmark,
    isTweetBookmarked: (tweetId: string) => bookmarkedTweets.includes(tweetId),
    showToast, // Pass the actual showToast function
    activeTab,
    setActiveTab,
    appUser,
    updateUserProfilePicture: async (userId: string, file: File) => {
      setLoadingProfileUpdate(true);
      try {
        const result = await updateUserProfilePicture(userId, file); // Call the original function
        // onAuthStateChanged should update firebaseUser, which updates appUser.
        // If immediate feedback is needed beyond toast, appUser could be manually updated here,
        // but it's generally better to rely on the auth state flow.
        setLoadingProfileUpdate(false);
        return result;
      } catch (error) {
        setLoadingProfileUpdate(false);
        // The error should be handled by useAuth and shown via its error state or a toast
        console.error("Error en AppContext al actualizar foto:", error);
        throw error; // Re-throw para que el componente que llama pueda manejarlo si es necesario
      }
    },
    loadingProfileUpdate,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
      {/* Toast component will be rendered in App.tsx to receive toastInfo */}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
