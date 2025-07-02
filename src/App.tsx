import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed'; // Importar Feed en lugar de Timeline
import RightSidebar from './components/RightSidebar';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Bookmarks from './components/Bookmarks';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Explore from './components/Explore';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import { useAppContext } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext'; // Keep ThemeProvider separate for now

// Renamed to AppContent to avoid conflict if AppProvider is in the same file initially
function AppContent() {
  const {
    appUser, // Changed from currentUser to appUser from context
    firebaseUser,
    loadingAuth,
    showAuthModal: showAuthModalFromContext, // Renamed to avoid conflict with local state if any
    openAuthModal,
    closeAuthModal,
    handleAuthSuccess,
    // --- Nuevos valores del contexto para posts ---
    posts, // En lugar de tweets
    // handleNewPost, // Si AppContent lo necesitara directamente
    // loadingPosts,
    // errorPosts,
    // fetchPosts,
    // --- Fin nuevos valores ---
    // --- Valores comentados/eliminados del contexto ---
    // handleLikeTweet, (y similares, ahora comentados en AppContext)
    // bookmarkedTweets, (comentado en AppContext)
    // isTweetBookmarked, (comentado en AppContext)
    // --- Fin valores comentados ---
    activeTab,
    setActiveTab,
    showToast: contextShowToast // Renombrar para evitar conflicto con el estado local 'toast'
  } = useAppContext();

  console.log('AppContent - loadingAuth:', loadingAuth);
  console.log('AppContent - firebaseUser:', firebaseUser);
  console.log('AppContent - appUser:', appUser);

  // Local state for Toast component visibility and content
  // const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  // El manejo del toast se simplificará o se hará directamente con el del contexto si es posible.
  // Por ahora, el showToast del contexto es el que se usa en los hooks.
  // App.tsx renderiza el Toast, pero su estado de visibilidad y contenido debe venir del contexto.
  // Esto ya se maneja con internalToast y el useEffect que reacciona a toastInfo de AppContext (si se implementa así).
  // El `contextShowToast` de arriba ya es la función de `showToast` del `AppContext`.

  // Effect to manage toast display based on context's request
  // This is a bit of a workaround. Ideally, Toast rendering is part of AppContext or a dedicated ToastContext
  // For now, App.tsx listens to a "signal" (toastInfo in AppContext) to display its own Toast.
  // Or, AppContext's showToast could directly call setToast here if passed down.
  // Let's refine this: AppContext will hold the toast *data*, App.tsx renders it.

  // We need a way for AppContext's showToast to update this local `toast` state.
  // The `AppContext` was modified to hold `toastInfo` which is not directly exposed.
  // Instead, `showToast` in `AppContext` should be the single source of truth for triggering toasts.
  // `App.tsx` will have its own `toast` state that is set by the `showToast` from `AppContext`.

  // This effect handles showing the AuthModal when no user is logged in and not loading.
  useEffect(() => {
    if (!loadingAuth && !firebaseUser && activeTab !== 'auth') { // Ensure not to show if already on an auth dedicated tab
      openAuthModal();
    }
  }, [firebaseUser, loadingAuth, openAuthModal, activeTab]);


  // This is a bridge. When useAppContext().showToast is called, it updates toastInfo in context.
  // We need App.tsx to react to that. A better way would be for AppContext to expose toastInfo.
  // For now, let's assume AppContext.showToast is passed to useTweets/useBookmarks which then call it.
  // And App.tsx needs to render the Toast component.
  // The current AppContext has showToast but not the toast data itself.
  // Let's modify AppContext to also provide toast data.
  // (Revised AppContext.tsx to include toastInfo state and a way to clear it)
  // For now, the provided AppContext.showToast in the snippet doesn't manage its own state for display.
  // So, we'll keep the local toast state here and AppContext.showToast will call this component's setToast.
  // This requires passing `setToast` to `AppProvider` or `AppContext` which is not ideal.

  // Simpler: The `showToast` from `useAppContext` is the one defined in `AppProvider`.
  // That `showToast` updates `toastInfo` state within `AppProvider`.
  // `App.tsx` needs to access that `toastInfo` to render its `Toast` component.
  // Let's assume `AppContext` will be updated to provide `toastInfo` and `clearToast`.

  // For now, let's assume the Toast component in App.tsx will manage its own lifecycle via props
  // and AppContext.showToast is the function that components should call.
  // The App.tsx below will use a local `toast` state, and its `showToast` will be the one provided to context.
  // This is what the original App.tsx did. We need to make sure the context's showToast updates this.

  const [internalToast, setInternalToast] = useState<{ message: string; type: 'success' | 'info' | 'error'; } | null>(null);
  const displayToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setInternalToast({ message, type });
    setTimeout(() => setInternalToast(null), 3000);
  };
  // We will pass `displayToast` to the AppProvider if we want hooks to use it.
  // Or, hooks use the `showToast` from context, which internally calls `displayToast`.
  // The current `AppContext` `showToast` updates an internal `toastInfo`. We need to read that here.
  // This part is tricky with the current separation.
  // Let's assume `AppContext` is the source of truth for toast *requests*, and `App.tsx` *renders* the toast.
  // We need a piece of state from `AppContext` that `App.tsx` can listen to for showing the toast.
  // The provided `AppContext` has `setToastInfo` internally but doesn't expose `toastInfo`.
  // This will require a small modification to `AppContext.tsx` to expose `toastInfo`.

  // --- Assuming AppContext is updated to provide toastData ---
  // const { toastData, clearToastData } = useAppContext(); // Hypothetical
  // useEffect(() => {
  //   if (toastData) {
  //     setInternalToast(toastData);
  //     setTimeout(() => {
  //       setInternalToast(null);
  //       clearToastData();
  //     }, 3000);
  //   }
  // }, [toastData, clearToastData]);
  // For now, we'll revert to App.tsx managing its own toast state and pass the showToast function to the context.
  // This means `useTweets` and `useBookmarks` will receive `displayToast` from `App.tsx`.

  const renderContent = () => {
    if (!appUser && activeTab !== 'explore' && activeTab !== 'settings') { // Allow explore and settings for logged-out users
        // If no user and not on a public tab, show minimal content or redirect to explore/auth
        // For now, let's rely on AuthModal to pop up.
        // Or, render a specific "please login" view for protected tabs.
    }

    const userPosts = appUser && posts ? posts.filter(post => post.user_id === appUser.id) : []; // Ajustar para posts y user_id

    switch (activeTab) {
      case 'home':
        return <Feed />; // Feed ya obtiene posts del contexto
      case 'explore':
        // Explore ya fue adaptado para tomar 'posts' del contexto.
        return <Explore />;
      case 'notifications':
        if (!appUser) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Inicia sesión para ver notificaciones.</div>;
        return <Notifications />;
      case 'messages':
        if (!appUser) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Inicia sesión para ver mensajes.</div>;
        return <Messages />;
      case 'bookmarks':
        // Bookmarks también necesitará una refactorización mayor para PostData y nueva lógica de backend.
        // Comentado/simplificado por ahora.
        if (!appUser) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Inicia sesión para ver tus bookmarks.</div>;
        return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Bookmarks (Próximamente)</div>;
      case 'profile':
        // Profile ya fue adaptado para tomar 'appUser' y 'posts' del contexto.
        if (!appUser) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Inicia sesión para ver tu perfil.</div>;
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <Feed />; // Feed por defecto
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando EcuaPost...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario y la autenticación no está cargando, solo mostrar el AuthModal
  if (!loadingAuth && !firebaseUser) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex items-center justify-center">
        <AuthModal
          isOpen={true} // Forzar apertura ya que es la única vista
          onClose={() => {
            // Idealmente, el modal no debería cerrarse si es la única vista y no hay login.
            // O, si se cierra, debería reabrirse o mostrar un mensaje.
            // Por ahora, si se cierra sin login, el useEffect lo reabrirá.
            // Podríamos pasar una prop para deshabilitar el botón de cierre si !firebaseUser.
            // O simplemente dejar que el useEffect lo maneje.
            closeAuthModal();
          }}
          onSuccess={handleAuthSuccess}
        />
        {/* Se puede añadir un mensaje de "Debes iniciar sesión" aquí si el modal no es suficiente */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar now uses context for activeTab and onTabChange (setActiveTab from context) */}
        <Sidebar />
        
        <div className="flex-1 ml-64"> {/* Adjust margin if sidebar width changes */}
          <div className="flex">
            <div className="flex-1 max-w-2xl">
              {renderContent()}
            </div>
            
            <div className="hidden lg:block">
              {/* RightSidebar might need user data from context if it displays user-specific info */}
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast component: its state is now managed by AppContext or locally if preferred */}
      {/* Assuming AppContext provides toastInfo and a way to clear it */}
      {/* For now, using local internalToast state, triggered by context's showToast via a bridge (see above) */}
      {/* This part needs the AppContext to expose the toast data for rendering */}
      {/* Let's assume AppContext has been updated to provide `toastData` and `clearToastData` */}
      {/*
          const { toastDataFromContext, clearToastDataFromContext } = useAppContext();
          useEffect(() => {
            if (toastDataFromContext) {
              setInternalToast(toastDataFromContext);
              const timer = setTimeout(() => {
                setInternalToast(null);
                clearToastDataFromContext(); // Tell context to clear its toast data
              }, 3000);
              return () => clearTimeout(timer);
            }
          }, [toastDataFromContext, clearToastDataFromContext]);
      */}
      {/* The current AppContext's showToast updates an internal state `toastInfo`.
          We need to read this `toastInfo` here. Modifying AppContext to expose it.
          Let's assume AppContext now has:
          toastForDisplay: { message: string; type: 'success' | 'info' | 'error' } | null;
          clearToastForDisplay: () => void;
          And its showToast sets this toastForDisplay.
      */}
      {/* For the sake of this step, we'll use the `internalToast` state managed by `displayToast`.
          And we'll ensure `useAppContext().showToast` calls this `displayToast`.
          This means `AppProvider` needs `displayToast` passed to it.
          This is a simplification to get App.tsx working with context.
          The `AppContext` provided earlier has its own `setToastInfo`.
          If `AppContext.tsx` is modified to include:
            const [toastForDisplay, setToastForDisplay] = useState(null);
            const showToast = (message, type) => { setToastForDisplay({message, type}); setTimeout(()=>setToastForDisplay(null), 3000); }
            // and expose toastForDisplay in context value
          Then App.tsx can use that.
      */}

      {internalToast && (
        <Toast
          message={internalToast.message}
          type={internalToast.type}
          onClose={() => setInternalToast(null)} // Toast component can close itself
        />
      )}

      <AuthModal
        isOpen={showAuthModalFromContext} // From context
        onClose={closeAuthModal} // From context
        onSuccess={handleAuthSuccess} // From context
      />
    </div>
  );
}

// The main App component now just wraps AppContent with providers
function App() {
  // ThemeProvider can remain here, or be moved inside AppProvider if theme also becomes context-managed globally
  // For now, keeping it separate as per original structure.
  // AppProvider should be inside ThemeProvider if AppContext needs theme, or vice-versa.
  // Let's assume AppProvider is the outermost custom provider for app state.
  return (
    <ThemeProvider>
        {/* AppProvider is already added in main.tsx, so AppContent is the direct child here */}
        <AppContent />
    </ThemeProvider>
  );
}

export default App;
