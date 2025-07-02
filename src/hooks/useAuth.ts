import { useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../config/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          phoneNumber: firebaseUser.phoneNumber
        };
        setUser(authUser);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('ecuapost-user', JSON.stringify(authUser));
        console.log('✅ Usuario autenticado:', authUser.displayName || authUser.email);
      } else {
        setUser(null);
        localStorage.removeItem('ecuapost-user');
      }
      setLoading(false);
    });

    // Verificar si hay un resultado de redirect pendiente al cargar la página
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('✅ Usuario logueado con redirect exitoso:', result.user.displayName || result.user.email);
          // El usuario ya se manejará en onAuthStateChanged
        }
      } catch (error: any) {
        console.error('❌ Error en redirect result:', error);
        setError(getErrorMessage(error));
      }
    };

    checkRedirectResult();

    return () => unsubscribe();
  }, []);

  const getErrorMessage = (error: any): string => {
    switch (error.code) {
      case 'auth/popup-blocked':
        return 'Las ventanas emergentes están bloqueadas. Usando método alternativo...';
      case 'auth/popup-closed-by-user':
        return 'Ventana de login cerrada. Inténtalo de nuevo.';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu internet.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Espera un momento.';
      case 'auth/account-exists-with-different-credential':
        return 'Ya existe una cuenta con este email usando otro método de login.';
      case 'auth/invalid-phone-number':
        return 'Número de teléfono inválido. Verifica el formato.';
      case 'auth/captcha-check-failed':
        return 'Verificación reCAPTCHA fallida. Inténtalo de nuevo.';
      case 'auth/unauthorized-domain':
        return 'Dominio no autorizado. Contacta al administrador.';
      default:
        return error.message || 'Error de autenticación';
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('🚀 Iniciando autenticación con Google...');
      
      // Detectar si estamos en móvil o si es probable que los popups estén bloqueados
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLikelyPopupBlocked = isMobile || window.navigator.userAgent.includes('Chrome');
      
      if (isLikelyPopupBlocked) {
        console.log('📱 Dispositivo móvil o popup probablemente bloqueado, usando redirect...');
        await signInWithRedirect(auth, googleProvider);
        // El resultado se manejará cuando la página se recargue
        return null;
      }
      
      // Intentar popup primero en desktop
      try {
        console.log('🖥️ Intentando popup en desktop...');
        const result = await signInWithPopup(auth, googleProvider);
        console.log('✅ Usuario logueado con Google (popup):', result.user.displayName || result.user.email);
        return result.user;
      } catch (popupError: any) {
        console.log('⚠️ Popup falló, cambiando a redirect:', popupError.code);
        
        // Si el popup falla, usar redirect como fallback
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          console.log('🔄 Usando redirect como fallback...');
          await signInWithRedirect(auth, googleProvider);
          return null;
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión con Google:', error);
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('🚀 Iniciando autenticación con Facebook...');
      
      // Detectar si estamos en móvil
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        console.log('📱 Dispositivo móvil, usando redirect...');
        await signInWithRedirect(auth, facebookProvider);
        return null;
      }
      
      // Intentar popup primero en desktop
      try {
        console.log('🖥️ Intentando popup en desktop...');
        const result = await signInWithPopup(auth, facebookProvider);
        console.log('✅ Usuario logueado con Facebook (popup):', result.user.displayName || result.user.email);
        return result.user;
      } catch (popupError: any) {
        console.log('⚠️ Popup falló, cambiando a redirect:', popupError.code);
        
        // Si el popup falla, usar redirect como fallback
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          console.log('🔄 Usando redirect como fallback...');
          await signInWithRedirect(auth, facebookProvider);
          return null;
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión con Facebook:', error);
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
    try {
      setError(null);
      setLoading(true);
      console.log('📱 Enviando código SMS a:', phoneNumber);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      console.log('✅ Código SMS enviado');
      return confirmationResult;
    } catch (error: any) {
      console.error('❌ Error al enviar SMS:', error);
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      localStorage.removeItem('ecuapost-user');
      console.log('✅ Sesión cerrada');
    } catch (error: any) {
      console.error('❌ Error al cerrar sesión:', error);
      setError(error.message);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithFacebook,
    signInWithPhone,
    signOut
  };
};