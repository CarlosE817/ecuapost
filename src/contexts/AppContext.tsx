// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PostData, User } from '../types'; // Usar PostData en lugar de Tweet
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts'; // Importar usePosts
// import { useBookmarks } from '../hooks/useBookmarks'; // Comentado por ahora si no se usa

interface AppContextType {
  // User session
  currentUser: User | null;
  firebaseUser: any;
  loadingAuth: boolean;
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  handleAuthSuccess: () => void;

  // Posts (antes Tweets)
  posts: PostData[];
  handleNewPost: (content: string) => Promise<void>; // Ya no maneja imágenes
  loadingPosts: boolean; // Estado de carga para posts
  errorPosts: string | null; // Estado de error para posts
  fetchPosts: () => Promise<void>; // Para re-fetch manual

  // TODO: Funciones comentadas para likes, retweets, etc. se añadirán después
  // handleLikePost: (postId: number) => void;
  // handleRetweetPost: (postId: number) => void;
  // handleReplyPost: (postId: number) => void;
  // handleDeletePost: (postId: number) => void;
  // handleEditPost: (postId: number, newContent: string) => void;

  // Bookmarks (comentado temporalmente, se puede reactivar después)
  // bookmarkedPosts: string[]; // o number[] si el ID es numérico
  // handleBookmarkPost: (postId: number) => void;
  // isPostBookmarked: (postId: number) => boolean;

  // Toast notifications
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Active Tab for navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Current User Profile (derived from firebaseUser)
  appUser: User | null;

  // Profile update (comentado temporalmente)
  // updateUserProfilePicture: (userId: string, file: File) => Promise<string | null>;
  // loadingProfileUpdate: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    user: firebaseUser,
    loading: loadingAuth,
    // updateUserProfilePicture, // Comentado en useAuth
    error: authError
  } = useAuth();

  // Specific loading state for profile picture update, separate from general loadingAuth (comentado)
  // const [loadingProfileUpdate, setLoadingProfileUpdate] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastInfo({ message, type });
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
    posts, // antes tweets
    handleNewPost, // antes handleNewTweet
    loading: loadingPosts, // específico de posts
    error: errorPosts,     // específico de posts
    fetchPosts,            // para re-fetch manual
    // Las funciones comentadas (handleLike, etc.) no se desestructuran aquí
  } = usePosts(appUser, showToast); // Pasar appUser a usePosts

  // const { bookmarkedTweets, handleBookmark } = useBookmarks(showToast); // Comentado

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  const handleAuthSuccess = () => {
    showToast('¡Bienvenido a EcuaPost!', 'success');
    closeAuthModal();
  };

  // appUser ya está derivado arriba

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
    loadingPosts,
    errorPosts,
    fetchPosts,

    // Bookmarks (comentado)
    // bookmarkedPosts: bookmarkedTweets,
    // handleBookmarkPost: handleBookmark,
    // isPostBookmarked: (postId: number) => bookmarkedTweets.includes(String(postId)), // Ajustar ID si es numérico

    // Toast
    showToast,

    // Navigation
    activeTab,
    setActiveTab,
    appUser, // Sigue siendo útil tenerlo directamente

    // Profile Update (comentado temporalmente según plan)
    // updateUserProfilePicture: async (userId: string, file: File) => {
    //   setLoadingProfileUpdate(true);
    //   try {
    //     const result = await updateUserProfilePicture(userId, file);
    //     setLoadingProfileUpdate(false);
    //     return result;
    //   } catch (error) {
    //     setLoadingProfileUpdate(false);
    //     console.error("Error en AppContext al actualizar foto:", error);
    //     throw error;
    //   }
    // },
    // loadingProfileUpdate,
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
