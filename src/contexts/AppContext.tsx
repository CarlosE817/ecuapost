// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PostData, User } from '../types';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';

interface AppContextType {
  // User session
  currentUser: User | null;
  firebaseUser: any;
  loadingAuth: boolean;
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  handleAuthSuccess: () => void;

  // Posts
  posts: PostData[];
  handleNewPost: (content: string) => Promise<void>;
  handleEditPost: (postId: number, newContent: string) => Promise<void>;
  handleDeletePost: (postId: number) => Promise<void>;
  loadingPosts: boolean;
  errorPosts: string | null;
  fetchPosts: () => Promise<void>;

  // Toast notifications
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Active Tab for navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Current User Profile (derived from firebaseUser)
  appUser: User | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    user: firebaseUser,
    loading: loadingAuth,
    error: authError
  } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastInfo({ message, type });
    console.log(`🔔 Toast: ${type.toUpperCase()} - ${message}`);
  };

  // Derivar appUser ANTES de pasarlo a usePosts
  const appUser = firebaseUser ? {
    id: firebaseUser.uid,
    username: firebaseUser.email?.split('@')[0] || firebaseUser.displayName?.toLowerCase().replace(/\s+/g, '_') || 'usuario_firebase',
    displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario Firebase',
    avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'UF')}&background=3b82f6&color=fff`,
    bio: 'Usuario de EcuaPost',
    followers: 0,
    following: 0,
    verified: firebaseUser.emailVerified || false,
  } : null;

  const {
    posts,
    handleNewPost,
    handleEditPost,
    handleDeletePost,
    loading: loadingPosts,
    error: errorPosts,
    fetchPosts,
  } = usePosts(appUser, showToast);

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  const handleAuthSuccess = () => {
    showToast('¡Bienvenido a EcuaPost!', 'success');
    closeAuthModal();
  };

  const contextValue: AppContextType = {
    // User session
    currentUser: appUser,
    firebaseUser,
    loadingAuth,
    showAuthModal,
    openAuthModal,
    closeAuthModal,
    handleAuthSuccess,

    // Posts
    posts,
    handleNewPost,
    handleEditPost,
    handleDeletePost,
    loadingPosts,
    errorPosts,
    fetchPosts,

    // Toast
    showToast,

    // Navigation
    activeTab,
    setActiveTab,
    appUser,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
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

export { AppContext };